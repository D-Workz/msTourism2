// =================================================================================
// App Logic
// =================================================================================

const request = require('request');
const mongoose = require('mongoose');
const config = require('config');
const requestFrequency = config.get("requestFrequencyMilliseconds");

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
mongoose.Promise = require('bluebird');
require('../model/Annotation');
require('../model/GeospatialProjection');

const Annotations = mongoose.model('Annotation');
const GeospatialProjections = mongoose.model('GeospatialProjection');

/**
 * the worker class of the extension
 * 1. a list of all annotations of an apiKey is requestd
 * 2. each annotation in the list is requested
 * 3. the annotation is saved in the mongoDB
 */
class SemantifyExtension {
    constructor(apikey, startExtension) {
        this.apikey = apikey["apikey"];
        this.requestPathListAnnotations = config.get("requestPathListAnnotations");
        this.requestPathDetailsOfAnnotation = config.get("requestPathDetailsOfAnnotation");
        this.host = config.get("host");
        this.website = apikey["website"];
        this.count = 0;
        this.totalCount = -1;
        this.callbackStartExtension = startExtension;
        this.requestRetryCount = 0;
    }

    /**
     * requests the list of all annotations from an apiKey
     */
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

    /**
     * checks if the annotation is in the desired language ( defined in config/default.json
     * @param annotationCID the CID contains a language tag at the end, which is used to identify the language of an annotation
     * @returns {*}
     */
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

    /**
     * request method used to request the annotations from semantify
     * @param annotations the list of all annotations
     * @param size the number of annotatuons
     * @param index the current index of the requested annotation
     * @param requestError used if there was an error with the last request
     */
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
                            //hooked in
                            that.updateGeospatialCollection(body, id);
                            
                            that.startNextAnnotation(annotations, index, size, requestFrequency);
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

    /**
     * called when one annotation is finished to start/request/check the next anotation
     * same parameters as doRequest() --> calls doRequest()
     * @param annotations
     * @param index
     * @param size
     * @param startTime
     */
    startNextAnnotation(annotations, index, size, startTime) {
        let that = this;
        index++;
        if (index < size) {
            setTimeout(function () {
                that.doRequest(annotations, size, index, 0);
            }, startTime);
        }
    }

    /**
     * parses the result of the request of the list of all annotations of an apiKey into json
     * requests the annotations calls doRequest()
     * @param allAnnotationsOfAPIKEY
     */
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


    /**
     * updateAnnotationCollection is used to update the annotation inside the mondoDB
     * @param annotation the annotation
     * @param id the id of the annotation is checked if exists already if so updated if not create new document
     * @param language of the annotation
     */
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
                        that.createNewAnnotation(annotationAsJson, id, language);
                    } else {
                        that.updateExistingAnnotation(annotationAsJson, annotation);
                    }
                })
        }

    };


    /**
     * Updates a GeoSpatialCollection inside the mingoDB
     * @param annotation the annotation used to retreive the geoSpatial information
     * @param id the annotationID used to check if exists inside GeoSPatialProjection
     */
    updateGeospatialCollection(annotation, id) {
        let annotationAsJson;
        let that = this;
        try {
            annotationAsJson = JSON.parse(annotation);
        } catch (err) {
            console.error("Couldnt process Annotation: " + err)
        }
        if (annotationAsJson) {
        	GeospatialProjections
                .findOne({annotationId: id})
                .then(function (annotation) {
                    if (!annotation) {
                        that.createNewAnnotationTypeGeospatial(annotationAsJson, id);
                    } else {
                        that.updateExistingAnnotationTypeGeospatial(annotationAsJson, annotation);
                    }
                })
        }

    };
//====================


    /**
     * updates the annotation of an annotation model
     * @param annotationDetailObject
     * @param existingAnnotation
     */
    updateExistingAnnotation(annotationDetailObject, existingAnnotation) {
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

    /**
     * Creates a new Anootation document inside the mondoDB
     * @param annotationDetailObject the annotation
     * @param id id of the annotation
     * @param language of the annotation
     */
    createNewAnnotation(annotationDetailObject, id, language) {
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

    /**
     * Update an existing geoSpatial inside MongoDB
     * @param annotationDetailObject
     * @param existingAnnotation
     */
    updateExistingAnnotationTypeGeospatial(annotationDetailObject, existingAnnotation) { 
    	let that = this;    	
	    if(annotationDetailObject.geo){	        
	        existingAnnotation = that.convertGeoToProjection(annotationDetailObject, existingAnnotation);
	        existingAnnotation.save(function (err, anno) {
	            if (err) {
	                console.error(err);
	            } else {
	                that.successfullySavingAnnotationGeospatial(true, anno._id);
	            }
	        });	        
	    }	    
    }

    /**
     * Creates a new GeoSpatialProjection document inside mongoDB
     * @param annotationDetailObject
     * @param id
     */
    createNewAnnotationTypeGeospatial(annotationDetailObject, id) {
    	let that = this;    	
	    if(annotationDetailObject.geo){	            	
	    	let newGeospatialProjections = new GeospatialProjections();
        
	    	newGeospatialProjections.annotationID = id;
	    	newGeospatialProjections=that.convertGeoToProjection(annotationDetailObject, newGeospatialProjections);

	    	newGeospatialProjections.save(function (err, anno) {
	            if (err) {
	                console.error(err);
	            } else {
	                that.successfullySavingAnnotationGeospatial(false, anno._id);
	            }
	        });
	    }
    }

    /**
     * Converts the semantic geo information into point coordinates
     * @param originalAnnotation
     * @param existingAnnotation
     * @returns {*}
     */
    convertGeoToProjection(originalAnnotation, existingAnnotation){
        var helper = originalAnnotation.geo;
        var longitudeToSet = 0;
        var latitudeToSet = 0;

		if(helper.longitude && helper.latitude && helper.longitude<=180 && helper.latitude<=90){
		  longitudeToSet=helper.longitude;
		  latitudeToSet=helper.latitude;
		}
		existingAnnotation.geoInfo={type:'Point', coordinates : [Number(longitudeToSet),Number(latitudeToSet)]};
		return existingAnnotation;
    }


    /**
     * Called as a success Method when annotation is successfully saved
     * @param found
     * @param id
     */
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

    /**
     * called as a success method when geoSpatialProjection is successfully saved
     * @param found
     * @param id
     */
    successfullySavingAnnotationGeospatial(found, id) {
        this.count++;
        console.log("----------------------\n" +
            "successfully updated: " + this.website);
        if (found) {
            console.log("Geospatial annotation updated: " + id);
        } else {
            console.log("new geospatial annotation added _id: " + id);
        }
        console.log("Annotations parsed: " + this.count + " of " + this.totalCount);
        if (this.count === this.totalCount) {
            this.callbackStartExtension.startNextWebsite();
        }
    }    
    

}


module.exports = SemantifyExtension;

