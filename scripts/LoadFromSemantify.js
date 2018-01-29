//required files

const request = require('request');
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("url_mongoDB"), {useMongoClient: true});
require('../model/FoodEstablishment');
const FoodEstablishment = mongoose.model('FoodEstablishment');

//variables for process
var annotationList = [];

//functions
deleteData();

//step 0 - delete all old entries
function deleteData() {
    FoodEstablishment.remove(function(err,removed) {
        console.log("Deleted "+removed+" entries from Mongo DB.");
        rec_loadAnnotationList(config.get("url_listMayrhofenAt"), 1000, 0);
    });
}

//step 1 - get a List of all Annotations to check
function rec_loadAnnotationList(url, limit, offset) {
    var targetURL = url+"?offset="+offset+"&limit="+limit;
    console.log("Starting request to "+targetURL);
    request({
        url: targetURL,
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
            //correct answer
            body = JSON.parse(body);
            annotationList.push.apply(annotationList, body.data);
            if((body.metadata.offset + body.metadata.limit) < body.metadata["total-count"]){
                rec_loadAnnotationList(url, body.metadata.limit, body.metadata.offset + body.metadata.limit)
            } else {
                console.log("finish load list from "+url+"\nAnnotations to check: "+annotationList.length);
                rec_checkAndLoadAnnotations(0);
            }
        }
    });
}

//step 2 - check the list of annotations and load from semantify those who are needed + save them in mongo db
function rec_checkAndLoadAnnotations(position) {
    if(annotationList.length <= position){
        //finished
        process.exit(0);
    } else {
        console.log("check annotation at position "+position);
        if(checkIfAnnotationShouldBeLoaded(annotationList[position])){

            let targetURL = config.get("url_annotationByCID")+annotationList[position].CID;
            console.log("Starting request to "+targetURL);
            request({
                url: targetURL,
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
                    //correct answer
                    body = JSON.parse(body);
                    let newMongoEntry = new FoodEstablishment();

                    newMongoEntry.name = annotationList[position].name;
                    if(annotationList[position].CID.endsWith("-de")){
                        newMongoEntry.language = "de";
                    } else if(annotationList[position].CID.endsWith("-en")){
                        newMongoEntry.language = "en";
                    }
                    newMongoEntry.CID = annotationList[position].CID;
                    newMongoEntry.sdoAnnotation = body;
                    if(Array.isArray(annotationList[position].type)){
                        newMongoEntry.sdoTypes = annotationList[position].type;
                    } else {
                        newMongoEntry.sdoTypes = [annotationList[position].type];
                    }
                    newMongoEntry.rating = 1;

                    newMongoEntry.save();
                    console.log("save annotation at position "+position);
                    rec_checkAndLoadAnnotations(position+1);
                }
            });
        } else {
            rec_checkAndLoadAnnotations(position+1);
        }
    }
}


function checkIfAnnotationShouldBeLoaded(dataItem) {
    if(dataItem.type === undefined){
        return false;
    }
    if(dataItem.CID === undefined){
        return false;
    }
    var typesToCheck = [];
    if(Array.isArray(dataItem.type)){
        typesToCheck = dataItem.type;
    } else {
        typesToCheck.push(dataItem.type);
    }
    //does the annotation have a desired SDO type?
    if(checkIfAnnotationTypeIsDesired(typesToCheck) === false){
        return false;
    }
    //is the annotation in a desired language?
    if(dataItem.CID.endsWith("-de") === false && dataItem.CID.endsWith("-en") === false){
        return false;
    }
    return true;
}

//if we accept Winery, we should accept Brewery, which is also a subtype of FoodEstablishment http://schema.org/FoodEstablishment
function checkIfAnnotationTypeIsDesired(typeArray) {
    let desiredTypes= [
      "FoodEstablishment","Bakery", "BarOrPub", "CafeOrCoffeeShop", "Restaurant", "FastFoodRestaurant", "IceCreamShop", "Winery", "Brewery"
    ];
    for(let i=0;i<typeArray.length;i++){
        if(desiredTypes.indexOf(typeArray[i]) !== -1){
            return true;
        }
    }
    return false;
}