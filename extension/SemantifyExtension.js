// =================================================================================
// App Logic
// =================================================================================

const request = require('request');
const mongoose = require('mongoose');
const config = require('config');
const RateLimiter = require('limiter').RateLimiter;

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/MapsMayrhofen');
// require('../model/MapsSeefeld');
// require('../model/MayrhofenAt');
// require('../model/SeefeldAt');
const MapsMayrhofen = mongoose.model('MapsMayrhofen');


class SemantifyExtension {
    constructor(apikey, name, startExtension) {
        this.apikey = apikey;
        this.requestPathListAnnotations = config.get("requestPathListAnnotations");
        this.requestPathDetailsOfAnnotation = config.get("requestPathDetailsOfAnnotation");
        this.host = config.get("host");
        this.limiter = new RateLimiter(1, 750);
        this.websiteName = name;
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
        let jsonAnnotations = JSON.parse(allAnnotationsOfAPIKEY);
        this.count = jsonAnnotations.length;
        for (let i = 0; i < jsonAnnotations.length; i++) {
            let annotationCID = jsonAnnotations[i].CID;
            let type = jsonAnnotations[i].type;
            this.limiter.removeTokens(1, function () {
                request({
                    url: that.host + that.requestPathDetailsOfAnnotation + annotationCID,
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
                        MapsMayrhofen.updateAnnotationCollection(body, type, that.websiteName, that);
                    }
                });
            });

        }
    }


}

module.exports = SemantifyExtension;

