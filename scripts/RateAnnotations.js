//is annotation valid? if has errors -> rating 0
//is annotation valid against DS 1, 2, 3, 4, etc. -> rating is the latest working ds

//required files
const request = require('request');
const mongoose = require('mongoose');
const config = require('config');
const fs = require('fs');
const path = require('path');

var logPath = path.join(__dirname, '/ratingLog.json');

mongoose.connect(config.get("url_mongoDB"), {useMongoClient: true});
require('../model/FoodEstablishment');
const FoodEstablishment = mongoose.model('FoodEstablishment');

let annotationList = [];
let actualAnnotationIndex = 0;
let analysisMemory = {};

//start rating process
getAllAnnotations();

//fetches all annotations from the local mongo db
function getAllAnnotations() {
    FoodEstablishment.find({}).exec(function (error, result) {
        annotationList = result;
        //console.log(result);
        checkIfAnnotationValid();
    })
}

//sends a request to the semantify API to check if the actual annotation is valid against SDO
function checkIfAnnotationValid() {
    let dataToSend = {};
    dataToSend.annotation = annotationList[actualAnnotationIndex].sdoAnnotation;
    request({
        url: config.get("url_annotationValid"),
        method: "POST",
        json: dataToSend
    }, function (error, response, body) {
        //console.log(body);
        if (error || response.statusCode !== 200) {
            if (error) {
                console.log(new Date().toISOString() + " error get from API: " + error.message);
            } else if (response.statusCode !== 200) {
                console.log(new Date().toISOString() + " response.statusCode: " + response.statusCode);
                console.log("response.statusText: " + response.statusMessage);
            }
        } else {
            //valid request and answer
            if(body.validationResult.isValid === true){
                console.log("Annotation at position "+actualAnnotationIndex+" is valid against the SDO vocabulary.");
                saveRating(annotationList[actualAnnotationIndex], 2, rateAnnotation);
            } else {
                console.log("Annotation at position "+actualAnnotationIndex+" is not valid against the SDO vocabulary.");
                saveRating(annotationList[actualAnnotationIndex], 0, rateNextAnnotation);
            }
        }
    });
}

//checks the properties of the actual annotation and saves the calculated rating in the local mongo db
function rateAnnotation() {
    let annotation = annotationList[actualAnnotationIndex].sdoAnnotation;
    let rating = 0;
    let end = false;
    //console.log(annotation);
    analysisIncrease("annotationsAmount");
    //phase 1 - MUST HAVE properties
    //name
    if(!end) {
        if(checkProperty(annotation, "name", ["Text"])){
            rating = rating + 5;
        } else {
            saveRating(annotationList[actualAnnotationIndex], 0, rateNextAnnotation);
            end = true;
        }
    }
    //address
    if(!end) {
        if(checkProperty(annotation, "address", ["Object"])){
            rating = rating + 5;
        } else {
            saveRating(annotationList[actualAnnotationIndex], 0, rateNextAnnotation);
            end = true;
        }
    }
    //description
    if(!end) {
        if(checkProperty(annotation, "description", ["Text"])){
            rating = rating + 5;
        } else {
            saveRating(annotationList[actualAnnotationIndex], 0, rateNextAnnotation);
            end = true;
        }
    }
    //phase 2 - SHOULD HAVE properties
    if(!end){
        //url
        if(checkProperty(annotation, "url", ["Text"])){
            rating = rating + 3;
        }
        //contactPoint
        if(checkProperty(annotation, "contactPoint", ["Object"])){
            rating = rating + 3;
        }
        //image
        if(checkProperty(annotation, "image", ["Object"])){
            rating = rating + 3;
        }
    }
    //phase 3 - WOULD BE COOL TO HAVE properties
    if(!end){
        //hasMap
        if(checkProperty(annotation, "hasMap", ["Text"])){
            rating = rating + 2;
        }
        //geo
        if(checkProperty(annotation, "geo", ["Object"])){
            rating = rating + 2;
        }
    }
    //phase 4 - COULD HAVE properties
    if(!end){
        //servesCuisine
        if(checkProperty(annotation, "servesCuisine", ["Text"])){
            rating = rating + 1;
        }
        //aggregateRating
        if(checkProperty(annotation, "aggregateRating", ["Object"])){
            rating = rating + 1;
        }
        //openingHoursSpecification
        if(checkProperty(annotation, "openingHoursSpecification", ["Object"])){
            rating = rating + 1;
        }
        //priceRange
        if(checkProperty(annotation, "priceRange", ["Text"])){
            rating = rating + 1;
        }
    }
    //finish process iteration
    if(!end){
        console.log("Annotation at position "+actualAnnotationIndex+" has rating "+rating+".");
        saveRating(annotationList[actualAnnotationIndex], rating, rateNextAnnotation);
    }
}


//saves the rating for an annotation in the local DB and executes the given callback
function saveRating(annotation, rating, callback) {
    FoodEstablishment.findById(annotation["_id"], function (err, foodEstablishment) {
        foodEstablishment.rating = rating;
        foodEstablishment.save(function (err, updatedFoodEstablishment) {
            callback()
        })
    });
}

//iteration step or end of the rating process
function rateNextAnnotation() {
    actualAnnotationIndex++;
    // if(actualAnnotationIndex > 4){
    //     console.log(JSON.stringify(analysisMemory, null, 2));
    //     process.exit(); //DEBUG
    // }
    if(actualAnnotationIndex >= annotationList.length){
        console.log("finished!");
        console.log(JSON.stringify(analysisMemory, null, 2));
        saveLog(JSON.stringify(analysisMemory, null, 2));
        process.exit();
    } else {
        console.log("Rate next Annotation.");
        checkIfAnnotationValid();
    }
}

//checks a given property from an annotation
//checks the type(s) of the value(s) based on the given expectedTypes
//sdo basic types or object
function checkProperty(annotation, property, expectedTypes) {
    if(checkIfObjectIsUndefined(annotation[property])){
        console.log("Annotation at position "+actualAnnotationIndex+" has no "+property+".");
        analysisIncrease(property+"_occurrenceError");
        return false;
    }
    let toCheck = [];
    if(checkIfObjectIsArray(annotation[property])){
        toCheck = annotation[property];
    } else {
        toCheck.push(annotation[property]);
    }
    for(let i=0;i<toCheck.length;i++){
        for(let j=0;j<expectedTypes.length;j++){
            switch (expectedTypes[j]){
                case "Text":
                    if(checkIfObjectIsString(toCheck[i])){
                        continue;
                    }
                    break;
                case "Object":
                    if(checkIfObjectIsObject(toCheck[i])){
                        continue;
                    }
                    break;
            }
            console.log("Annotation at position "+actualAnnotationIndex+" has "+property+" with valueType that is not wished: "+JSON.stringify(expectedTypes));
            analysisIncrease(property+"_valueTypeError");
            return false;
        }
    }
    return true;
}

//increases a given analysis memory entry by one
function analysisIncrease(entryName) {
    if(checkIfObjectIsUndefined(analysisMemory[entryName])){
        analysisMemory[entryName] = 1;
    } else {
        analysisMemory[entryName] = analysisMemory[entryName] + 1;
    }
}

//save log file
function saveLog(json) {
    fs.writeFileSync(logPath, json, 'utf8');
}

//helper functions
function checkIfObjectIsArray(object) {
    if(Array.isArray(object)){
        return true;
    }
    return false;
}

function checkIfObjectIsObject(object) {
    if(Array.isArray(object)){
        return false;
    }
    if (object === undefined || object === null) {
        return false;
    }
    return typeof object === 'object';
}

function checkIfObjectIsString(object) {
    if (object === undefined || object === null) {
        return false;
    }
    return typeof object === 'string' || object instanceof String;
}

function checkIfObjectIsNumber(object) {
    if (object === undefined || object === null) {
        return false;
    }
    return typeof object === 'number';
}

function checkIfObjectIsBoolean(object) {
    if (object === undefined || object === null) {
        return false;
    }
    return typeof object === 'boolean';
}

function checkIfObjectIsUndefined(object) {
    return object === undefined;
}

function checkIfObjectIsNull(object) {
    return object === null;
}