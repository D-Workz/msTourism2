const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
mongoose.Promise = require('bluebird');

require('../model/MapsSeefeld');
require('../model/MayrhofenAt');
require('../model/SeefeldAt');


let mapsMayrhofenSchema = new mongoose.Schema({
    type: {type: String, unique: true},
    annotations: [],
    count: Number
});

// {"name":"Fischerrun","id":"59b6a76f9b0def28bae6dfc3","UID":"rJ-DOvXE9-","CID":"GS-1001510-de","type":["SportsActivityLocation"],"enc_url":"https%3A%2F%2Fmaps.seefeld.com%2Fde%23resourceDetail%2C1001510"},

mapsMayrhofenSchema.statics.updateAnnotationCollection = function (annotation, type, website, cid, callbackSemantifyExtension) {
    const Annotations = mongoose.model(website);
    let annotationAsJson;
    try {
        annotationAsJson = JSON.parse(annotation);
    } catch (err) {
        console.error("Couldnt process Annotation: " + err)
    }
    if (annotationAsJson) {
        let lang = "unknown";
        if (cid.indexOf("en") >= 0) {
            lang = "en";
        } else if (cid.indexOf("de") >= 0) {
            lang = "de";
        }
        let annotationDetailObject = {
            cid: cid,
            allTypes: type,
            language: lang,
            annotation: annotationAsJson
        };
        for (let k = 0; k < type.length; k++) {
            Annotations
                .findOne({type: type[k]})
                .then(function (annotationType) {
                    if (!annotationType) {
                        createNewAnnotationType(annotationDetailObject, type[k], website, callbackSemantifyExtension);
                    } else {
                        updateExistingAnnotationType(annotationType, annotationDetailObject, type[k], website, callbackSemantifyExtension);
                    }
                })
        }
    }

};

function updateExistingAnnotationType(annotationType, annotationDetailObject, type, website, callbackSemantifyExtension) {
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

function createNewAnnotationType(annotationDetailObject, type, website, callbackSemantifyExtension) {
    const Annotations = mongoose.model(website);
    let cid = annotationDetailObject.cid;
    let newAnnotationsType = new Annotations();
    newAnnotationsType.type = type;
    newAnnotationsType.count = 1;
    newAnnotationsType.annotations.push(annotationDetailObject);
    newAnnotationsType.save(function (err) {
        if (err) {
            return next(err);
        } else {
            successfullySavingAnnotation(type, website, cid, false, callbackSemantifyExtension);
        }
    });
}

function successfullySavingAnnotation(type, website, cid, found, callbackSemantifyExtension) {
    callbackSemantifyExtension.count--;
    console.log(
        "successfully updated: " + website +
        " \n Type: " + type +
        "\n Annotations left to parse: " + callbackSemantifyExtension.count
    );
    if (found) {
        console.log("content updated. cid: " + cid);
    } else {
        console.log("new annotation added cid: " + cid);
    }
    console.log("successfully updated: " + website + " \n Type: " + type + "\n Annotations left to parse: " + callbackSemantifyExtension.count);
    if (callbackSemantifyExtension.count === 0) {
        callbackSemantifyExtension.callbackStartExtension.startNextWebsite();
    }
}

mongoose.model('MapsMayrhofen', mapsMayrhofenSchema);