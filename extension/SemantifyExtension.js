// =================================================================================
// App Logic
// =================================================================================

const request = require('request');
const mongoose = require('mongoose');
const config = require('config');
const RateLimiter = require('limiter').RateLimiter;

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/Mayrhofen');
const Mayrhofen = mongoose.model('Mayrhofen');
const Seefeld = mongoose.model('Seefeld');


class SemantifyExtension {
    constructor(apikey, startExtension) {
        this.apikey = apikey["apikey"];
        this.requestPathListAnnotations = config.get("requestPathListAnnotations");
        this.requestPathDetailsOfAnnotation = config.get("requestPathDetailsOfAnnotation");
        this.host = config.get("host");
        this.limiter = new RateLimiter(1, 750);
        this.MongooseModel =  mongoose.model(apikey["type"]);
        this.websiteType =  apikey["type"];
        this.count = -1;
        this.callbackStartExtension = startExtension;
    }

    requestAnnotationsFromSemantify() {
        let that = this;
        request({
            url: this.host + this.requestPathListAnnotations + this.apikey,
            method: "GET"
        }, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                if (error) {
                    console.log(new Date().toISOString() + " error get from API: " + error.message);
                } else if (response.statusCode !== 200) {
                    console.log(new Date().toISOString() + " response.statusCode: " + response.statusCode);
                    console.log("response.statusText: " + response.statusMessage);
                }
            } else {
                that.requestAnnotationDetailsFromSemantify(body);
            }
        });
    }

    requestAnnotationDetailsFromSemantify(allAnnotationsOfAPIKEY) {
        let that = this;
        let jsonAnnotations;
        try {
            jsonAnnotations = JSON.parse(allAnnotationsOfAPIKEY);
        } catch (err) {
            jsonAnnotations = 0;
        }
        this.count = jsonAnnotations.length;
        for (let i = 0; i < jsonAnnotations.length; i++) {
            let annotationCID = jsonAnnotations[i].CID;
            if (annotationCID.indexOf("en") >= 0) {
                let annotationId = jsonAnnotations[i].id;
                this.limiter.removeTokens(1, function () {
                    request({
                        url: that.host + that.requestPathDetailsOfAnnotation + annotationId,
                        method: "GET"
                    }, function (error, response, body) {
                        if (error || response.statusCode !== 200) {
                            if (error) {
                                console.log(new Date().toISOString() + " error get from API: " + error.message);
                            } else if (response.statusCode !== 200) {
                                console.log(new Date().toISOString() + " response.statusCode: " + response.statusCode);
                                console.log("response.statusText: " + response.statusMessage);
                            }
                        } else {
                            that.updateAnnotationCollection(body);
                        }
                    });
                });


            }


        }
    }


    updateAnnotationCollection(annotation) {
        let annotationAsJson;
        try {
            annotationAsJson = JSON.parse(annotation);
        } catch (err) {
            console.error("Couldnt process Annotation: " + err)
        }
        if (annotationAsJson) {
            this.MongooseModel
                .find({name: annotationAsJson.name})
                .then(function (annotation) {
                    if (!annotation) {
                        createNewAnnotationType(annotationAsJson);
                    } else {
                        updateExistingAnnotationType(annotationAsJson, annotation);
                    }
                })
        }

    };


}


function updateExistingAnnotationType(annotationDetailObject, existingAnnotation) {
    let cid = annotationDetailObject.cid;
    let found = false;
    for (let i = 0; i < annotationType.annotations.length; i++) {
        if (annotationType.annotations[i].cid === cid) {
            found = true;
            annotationType.annotations[i] = annotationDetailObject;
            break;
        }
    }
    if (!found) {
        annotationType.count++;
        annotationType.annotations.push(annotationDetailObject);
    }

    annotationType.markModified("annotations");
    annotationType.save(function (err) {
        if (err) {
            console.error(err);
        } else {
            successfullySavingAnnotation(type, website, cid, found, callbackSemantifyExtension);
        }
    });
}

function createNewAnnotationType(annotationDetailObject) {
    let newAnnotationsType = new this.MongooseModel();
    newAnnotationsType.type = annotationDetailObject.type;
    newAnnotationsType.name = annotationDetailObject.name;
    newAnnotationsType.annotationId = annotationDetailObject._id;
    newAnnotationsType.annotation = annotationDetailObject.content;
    newAnnotationsType.save(function (err, anno) {
        if (err) {
            console.log(err);
        } else {
            successfullySavingAnnotation(false, anno._id);
        }
    });
}

function successfullySavingAnnotation(found, id) {
    this.count--;
    console.log(
        "successfully updated: " + this.websiteType +
        "\n Annotations left to parse: " + this.count
    );
    if (found) {
        console.log("content updated. _id: " + id);
    } else {
        console.log("new annotation added _id: " + id);
    }
    console.log("successfully updated: " + this.websiteType + " \n Annotations left to parse: " + this.count);
    if (this.count === 0) {
        this.callbackStartExtension.startNextWebsite();
    }
}

module.exports = SemantifyExtension;

