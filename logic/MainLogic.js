// =================================================================================
// App Logic
// =================================================================================
const config = require('config');
const app = require('jovo-framework').Jovo;
const mongoose = require('mongoose');
mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/MapsMayrhofen');
require('../model/MapsSeefeld');
require('../model/MayrhofenAt');
require('../model/SeefeldAt');

const MapsMayrhofen = mongoose.model('MapsMayrhofen');
const MapsSeefeld = mongoose.model('MapsSeefeld');
const SeefeldAt = mongoose.model('SeefeldAt');
const MayrhofenAt = mongoose.model('MayrhofenAt');


class Logic {
    constructor() {
    }

    static getHandlers() {
        return {
            'LAUNCH': function () {
                app.toIntent('HelloWorldIntent');
            },

            'HelloWorldIntent': function (data) {
            	if(data){
            		console.log(data)
            	}
                app.tell('I like trains');
            },

            'ListHotels': function () {
                intendListHotels(app);
            },
            'TEST_LIST_SOMETHING' : function(){
            	console.log("\nTEST_LIST_SOMETHING-Intent activated");

            	var thing = app.inputs.thing;
            	var place = app.inputs.place;
            	
            	console.log("Input parameters: thing='"+thing+"', place='"+place+"'")
            	
            	var database;
            	
            	if(place==='Seefeld'){
            		database=SeefeldAt;
            	}else if(place==='Mayrhofen'){
            		database=MapsMayrhofen;
            	}else{
            		app.tell("Where should I look?");
            		return;
            	}
            	
            	if(thing==='Things'){
	            	database.aggregate({$unwind:"$annotations"}).then(function(dataSet){
	            		app.tell("I found "+dataSet.length+" Things in "+place+". Can you be more specific?");
	            		return;
	            	})
            	}else{
	            	database.aggregate({$unwind:"$annotations"},{$match : {"type":thing}}).then(function(dataSet){
	            		app.tell("I found "+dataSet.length+" "+thing+"s in "+place+". Can you be more specific?");
	            		return;
	            	})            		
            	}            	            	
            },            
            //just test-intends
            'TEST_TestIntentWithParam': function(){
            	console.log(app.inputs);
            	app.setSessionAttribute("prevInputs", app.inputs);
            	//app.tell("Alright");
            	app.followUpState('TestState').ask("Do you want something?","Yes or no");
            },
            'TestState' : {
            	'TEST_YesIntent' : function(){
            		console.log(app.getSessionAttribute("prevInputs"))
            		app.tell("I like trains");
            	},
            	'TEST_NoIntent' : function(){
            		app.tell("I don't like trains");
            	}
            }
        };
    }

}

function intendListThings(app, database){
	database.find({}).then(function(dataSet){
		console.log(dataSet.length)
	})
	aggregate({$unwind:"$annotations"}).toArray().length
}

function intendListHotels(app) {
//	console.log(app.inputs)
    MapsMayrhofen
        .findOne({type: "Hotel"})
        .then(function (hotelObject) {
            let maxBoundry = 0;
            let responseMsg = "";
            let foundAnnotations = [];
            let addressLocality;
            for (let k = 0; k < hotelObject.annotations.length; k++) {
                let annotationAddressLocality;
                try {
                    annotationAddressLocality = hotelObject.annotations[k].annotation.address.addressLocality;
                } catch (err) {
                    console.warn("Cant get address Locality");
                }
                if (annotationAddressLocality) {
                    if (app.inputs["geo-city"] !== "") {
                        addressLocality = app.inputs["geo-city"];
                    } else if (app.inputs.villages !== "") {
                        addressLocality = app.inputs.villages;
                    } else {
                        app.tell('Name a place.');
                        return;
                    }
                    if (annotationAddressLocality === addressLocality) {
                        foundAnnotations.push(hotelObject.annotations[k].annotation);
                    }
                }
            }
            if (foundAnnotations.length <= app.inputs.number) {
                maxBoundry = foundAnnotations.length;
            } else {
                maxBoundry = app.inputs.number;
            }
            for (let i = 0; i < maxBoundry; i++) {
                responseMsg += foundAnnotations[i].name + ", "
            }
            app.tell('We found: ' + hotelObject.count + " Hotels in our Database. There are in " + addressLocality + " there are" + foundAnnotations.length + " in total. And the top: " + maxBoundry + " Hotelnames are: " + responseMsg);
        });
}

module.exports = Logic;

