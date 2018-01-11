const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});

let AnnotationSchema = new mongoose.Schema({
    type: {type: String},
    name: {type: String},
    annotation: {type: Object},
    annotationId: {type: String, unique: true},
    website: {type: String},
    language: {type: String}
});

/**
 * mergeFindOne (mfindOne),
 * merges two objects if query returns more than one result into one resultObject
 * @param query
 * @returns {Promise} one resultObject
 */
AnnotationSchema.statics.mfindOne = function (query) {
    let that = this;
    return this
        .find(query)
        .then(function (results) {
            if (results.length > 1) {
                if (results.length > 2) {
                    console.warn("Found more than 2 Objects with the query. Choosing first two ignoring the rest. CHECK YOUR QUERY!");
                }
                let resultAnnotation = that.mergeAnnotations(results[0]._doc.annotation,results[1]._doc.annotation);
                let resultObject = results[0]._doc;
                resultObject.website = [resultObject.website, results[1]._doc.website];
                resultObject.type = stringyfyTypeArray(resultAnnotation["@type"]);
                resultObject.annotation = resultAnnotation;
                return resultObject;
            } else {
                if (results != 0) return [results[0]._doc];
                else return results;
            }
        })

};

/**
 * Merges two annotations:
 * takes the first layer of both annotations and creates a returnObject with the combined properties
 * Furthermore merges Types and amenityFeatures together
 * @param annotation1
 * @param annotation2
 * @returns the resultObject
 */
AnnotationSchema.statics.mergeAnnotations = function (annotation1, annotation2) {

    let resultAnnotation = annotation1;
    let additionalAnnotation = annotation2;
    if (validateEqualityForMerge(resultAnnotation, additionalAnnotation)) {
        for (let additionalAnnotationKey in additionalAnnotation) {
            let found = false;
            let amenityFeature = false;
            let annotationType = false;
            if (additionalAnnotationKey === "amenityFeature") amenityFeature = true;
            if (additionalAnnotationKey === "@type") annotationType = true;
            for (let resultAnnotationKey in resultAnnotation) {
                if (additionalAnnotationKey === resultAnnotationKey) {
                    found = true;
                    if (amenityFeature) resultAnnotation[additionalAnnotationKey] = mergeAmenityFeatures(resultAnnotation[resultAnnotationKey], additionalAnnotation[additionalAnnotationKey]);
                    if (annotationType) resultAnnotation[additionalAnnotationKey] = mergeAnnotationTypes(resultAnnotation[resultAnnotationKey], additionalAnnotation[additionalAnnotationKey]);
                    break;
                }
            }
            if (!found) {
                resultAnnotation[additionalAnnotationKey] = additionalAnnotation[additionalAnnotationKey];
            }
        }
    } else {
        console.log("Couldnt be shown that equal. Using only first annotation.");
    }
    return resultAnnotation;
};

/**
 * Validates if two annotations are structuring the same object, if true the two objects can be merged.
 * (So far uses the annotation addresses)
 * returns true or false depending of the result of the check.
 * @param annotation1
 * @param annotation2
 * @returns {boolean}
 */
function validateEqualityForMerge(annotation1, annotation2) {
    let equal = false;
    let addressOfAnnotation1 = annotation1["address"];
    let addressOfAnnotation2 = annotation2["address"];
    for (let addressPartOfA1 in addressOfAnnotation1) {
        for (let addressPartOfA2 in addressOfAnnotation2) {
            if (addressPartOfA1 === addressPartOfA2) {
                if (addressPartOfA1 === "streetAddress" || addressPartOfA1 === "postalCode" || addressPartOfA1 === "addressRegion" || addressPartOfA1 === "addressLocality") {
                    if (addressOfAnnotation1[addressPartOfA1] === addressOfAnnotation2[addressPartOfA1]) {
                        equal = true;
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        if (equal) break;
    }
    return equal;
}

function stringyfyTypeArray(typeArray) {
    let resultString = typeArray[0];
    if (typeArray.length > 1) {
        for (let i = 1; i < typeArray.length; i++) {
            resultString += ", " + typeArray[i];
        }
    }
    return resultString;
}

/**
 * merges two AmenityFeatureArrays into one resultArray
 * @param amenityFeatureArray1
 * @param amenityFeatureArray2
 * @returns resultArray
 */
function mergeAmenityFeatures(amenityFeatureArray1, amenityFeatureArray2) {
    let resultAmenityFeatureArray = amenityFeatureArray1;
    for (let additionalAmenityFeature in amenityFeatureArray2) {
        let found = false;
        for (let resultAmenityFeature in resultAmenityFeatureArray) {
            if (additionalAmenityFeature === resultAmenityFeature) {
                found = true;
                break;
            }
        }
        if (!found) {
            resultAmenityFeatureArray[additionalAmenityFeature] = amenityFeatureArray2[additionalAmenityFeature];
        }
    }
    return resultAmenityFeatureArray;
}

/**
 * merges types of different annotations into one resultArray
 * @param annotationType1
 * @param annotationType2
 * @returns resultArray
 */
function mergeAnnotationTypes(annotationType1, annotationType2) {
    let resultTypes;
    if (Array.isArray(annotationType1)) {
        resultTypes = annotationType1;
    } else {
        resultTypes = [annotationType1];
    }
    if (!Array.isArray(annotationType2)) {
        annotationType2 = [annotationType2];
    }
    for (let additionalType in annotationType2) {
        let found = false;
        for (let resultType in resultTypes) {
            if (annotationType2[additionalType] === resultTypes[resultType]) {
                found = true;
                break;
            }
        }
        if (!found) {
            resultTypes.push(annotationType2[additionalType]);
        }
    }
    return resultTypes;
}

mongoose.model('Annotation', AnnotationSchema);