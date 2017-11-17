// =================================================================================
// App Logic
// =================================================================================

const request = require('request');
const mongoose = require('mongoose');
const config = require('config');
const RateLimiter = require('limiter').RateLimiter;
const limiterConfig = config.get("limiter");

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
mongoose.Promise = require('bluebird');
require('../model/Annotation');
const Annotations = mongoose.model('Annotation');


class SemantifyExtension {
    constructor(apikey, startExtension) {
        this.apikey = apikey["apikey"];
        this.requestPathListAnnotations = config.get("requestPathListAnnotations");
        this.requestPathDetailsOfAnnotation = config.get("requestPathDetailsOfAnnotation");
        this.host = config.get("host");
        this.limiter = new RateLimiter(limiterConfig["requestsPerMs"], limiterConfig["milliseconds"]);
        this.website = apikey["website"];
        this.count = 0;
        this.totalCount = -1;
        this.callbackStartExtension = startExtension;
        this.requestRetryCount = 0;
    }

    requestAnnotationsFromSemantify() {
        let that = this;
        request({
            url: this.host + this.requestPathListAnnotations + this.apikey + "?limit=0",
            method: "GET"
        }, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                if (error) {
                    console.log(new Date().toISOString() + " error get from API: " + error.message);
                } else if (response.statusCode !== 200) {
                    console.log(new Date().toISOString() + " response.statusCode: " + response.statusCode);
                    console.log("response.statusText: " + response.statusMessage);
                }
                setTimeout(function () {
                    console.log("Request failed, trying again.");
                    that.requestRetryCount++;
                    if (that.requestRetryCount > 30) {
                        console.warn("Requests failed: " + that.requestRetryCount);
                    }
                    that.requestAnnotationsFromSemantify()
                }, 7500);
            } else {
                that.requestAnnotationDetailsFromSemantify(body);
            }
        });
    }

    checkIfAnnotationDesired(annotationCID) {
        let annotationLanguage = null;
        let desiredLanguages = config.get("languages");
        for (let language in desiredLanguages) {
            if (annotationCID.indexOf("-"+desiredLanguages[language]) !== -1) {
                annotationLanguage = desiredLanguages[language];
                break;
            }
        }
        return annotationLanguage;
    }

    doRequest(annotations, size, index, requestError) {
        let that = this;
        let annotationCID = annotations[index].CID;
        if (annotationCID) {
            let annotationLanguage = this.checkIfAnnotationDesired(annotationCID);
            if (annotationLanguage !== null) {
                let annotationId = annotations[index].id;
                (function (id, cid, language, requestError, index, size) {
                    request({
                        url: that.host + that.requestPathDetailsOfAnnotation + cid,
                        method: "GET"
                    }, function (error, response, body) {
                        if (error || response.statusCode !== 200) {
                            if (error) {
                                console.log(new Date().toISOString() + " error get from API: " + error.message);
                            } else if (response.statusCode !== 200) {
                                console.log(new Date().toISOString() + " response.statusCode: " + response.statusCode);
                                console.log("response.statusText: " + response.statusMessage);
                            }
                            setTimeout(function () {
                                requestError++;
                                console.warn("Request failed, trying again. Times tried: " + requestError);
                                if (requestError >= 5) {
                                    console.log("---------------" +
                                        "To many errors. On single Annotation \n Skipping: " + cid + "Starting next annotation.");
                                    index++;
                                    that.requestRetryCount++;
                                }
                                if (that.requestRetryCount > 30) {
                                    console.warn("Requests failed: " + that.requestRetryCount);
                                }
                                if (that.requestRetryCount > 150) {
                                    console.log("After 150 request retries starting next website.")
                                    that.callbackStartExtension.startNextWebsite();
                                } else {
                                    that.doRequest(annotations, size, index, requestError);
                                }
                            }, 750);
                        } else {
                            that.updateAnnotationCollection(body, id, language);
                            that.startNextAnnotation(annotations, index, size, 750);
                        }
                    });
                })(annotationId, annotationCID, annotationLanguage, requestError, index, size);
            } else {
                this.count++;
                console.log("--------------- \n Checked: " + annotationCID + " it isnt in a desired Language! increase count: " + this.count + " of " + this.totalCount);
                that.startNextAnnotation(annotations, index, size, 0);
                if (this.count === this.totalCount) {
                    this.callbackStartExtension.startNextWebsite();
                }
            }
        } else {
            this.count++;
            console.log("------------------- \n No CID found cant to request. Start next annotation.");
            that.startNextAnnotation(annotations, index, size, 0);
        }
    }

    startNextAnnotation(annotations, index, size, startTime) {
        let that = this;
        index++;
        if (index < size) {
            setTimeout(function () {
                that.doRequest(annotations, size, index, 0);
            }, startTime);
        }
    }

    requestAnnotationDetailsFromSemantify(allAnnotationsOfAPIKEY) {
        let jsonAnnotations;
        try {
            jsonAnnotations = JSON.parse(allAnnotationsOfAPIKEY);
            if (jsonAnnotations.metadata["total-count"]) {
                this.totalCount = jsonAnnotations.metadata["total-count"];
            } else {
                this.totalCount = jsonAnnotations.data.length;
            }
            let numberOfRequests = jsonAnnotations.data.length;
            this.doRequest(jsonAnnotations.data, numberOfRequests, 0, 0);
        } catch (err) {
            console.error(err);
        }

    }


    updateAnnotationCollection(annotation, id, language) {
        let annotationAsJson;
        let that = this;
        try {
            annotationAsJson = JSON.parse(annotation);
        } catch (err) {
            console.error("Couldnt process Annotation: " + err)
        }
        if (annotationAsJson) {
            Annotations
                .findOne({annotationId: id})
                .then(function (annotation) {
                    if (!annotation) {
                        that.createNewAnnotationType(annotationAsJson, id, language);
                    } else {
                        that.updateExistingAnnotationType(annotationAsJson, annotation);
                    }
                })
        }

    };

    updateExistingAnnotationType(annotationDetailObject, existingAnnotation) {
        let that = this;
        existingAnnotation.type = annotationDetailObject["@type"];
        existingAnnotation.name = annotationDetailObject.name;
        existingAnnotation.annotation = annotationDetailObject;
        existingAnnotation.save(function (err, anno) {
            if (err) {
                console.error(err);
            } else {
                that.successfullySavingAnnotation(true, anno._id);
            }
        });
    }

    createNewAnnotationType(annotationDetailObject, id, language) {
        let that = this;
        let newAnnotationsType = new Annotations();
        newAnnotationsType.type = annotationDetailObject["@type"];
        newAnnotationsType.name = annotationDetailObject.name;
        newAnnotationsType.annotationId = id;
        newAnnotationsType.language = language;
        newAnnotationsType.annotation = annotationDetailObject;
        newAnnotationsType.website = this.website;
        newAnnotationsType.save(function (err, anno) {
            if (err) {
                console.error(err);
            } else {
                that.successfullySavingAnnotation(false, anno._id);
            }
        });
    }


    successfullySavingAnnotation(found, id) {
        this.count++;
        console.log("----------------------\n" +
            "successfully updated: " + this.website);
        if (found) {
            console.log("annotation updated: " + id);
        } else {
            console.log("new annotation added _id: " + id);
        }
        console.log("Annotations parsed: " + this.count + " of " + this.totalCount);
        if (this.count === this.totalCount) {
            this.callbackStartExtension.startNextWebsite();
        }
    }


}


module.exports = SemantifyExtension;

