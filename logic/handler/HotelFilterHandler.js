const path = require('path');
let CURRENT_FILE = path.basename(__filename);

const Constants = require("./../../config/Constants");
const Logger = require('./../Logger');
const HelperMethods = require('./../HelperMethods');
const QueryBuilder = require("./../QueryBuilder");

class HotelFilterHandler {

    constructor() {
    	this.queryBuilder = new QueryBuilder();
	}
	
	doFulfill(app,db){
		
		let numVal = HelperMethods.ensureNumber(app.inputs.numVal);
		if(!numVal || numVal ===0  ) {numVal = 1}
		let filterType = app.inputs.filter;
		//if(filterType){}
        let that = this;


		app.db().load("type",(err,type) => {

            app.db().load("city", (err, city) => {
                if (type) {
                        that.searchAndFilter(app, db, numVal, city, filterType, type, (resultString) => {
                            app.followUpState("SelectThingState")
                                .ask(resultString, Constants.INFO_NOT_UNDERSTAND + resultString);
                        });
                } else {
                	Logger.warn(CURRENT_FILE,"No type defined?");
                    app
                        .followUpState("ThingKnownState")
                        .ask(Constants.NO_TYPE_DEFINED, Constants.INFO_NOT_UNDERSTAND);
                }
            });
        });



    }
//TODO: save query-context for listPagingHandler!!
    searchAndFilter(app, db, numVal, city, filterType, thingType, outputFunction) {
        let that = this;
    	Logger.log(CURRENT_FILE,"Search triggered: {numVal: "+numVal+", city: "+city+", filterType: "+filterType+", thingType: "+thingType+"}");

        if (thingType === 'Hotel') {
            if (filterType === "price") {
                if(!numVal || numVal ===0 || numVal <0  ) {numVal = 1000}
                db.find(this.queryBuilder.buildPriceFilter(thingType, city, HelperMethods.ensureNumber(numVal))).then((data) => {
                    if (data.length > 0) {

                        let sorted = HelperMethods.prepareAndSortHotelsPricing(data);
                        Logger.log(CURRENT_FILE,"Save ListHotels with length: " + data.length);

                        app.db().save("listHotels", HelperMethods.extractFrom(sorted), (err) => {
                        	//save formatted output
                        	app.db().save("formattedOutput", HelperMethods.formatOutputStructuredSave(sorted, "EUR", data.length,thingType), (err) => {
                        		// reset page count
            			    	app.db().save("pageCount", 0, (err) => {
            			    		outputFunction(HelperMethods.formatOutput(sorted.slice(0, Constants.TOP_N), "EUR", data.length,thingType));
            			    	});
                        	})
                        })
                    } else {
                    	Logger.log(CURRENT_FILE,"No hotels found with price <= "+numVal);
                        outputFunction("I couldn't find any hotels according to that price specification.");
                    }
                })
            } else if (filterType === "rating") {
                if(!numVal || numVal ===0 || numVal <0 || numVal > 5  ) {numVal = 1}
                db.find({
                    type: new RegExp(thingType, "i"),
                    website: new RegExp(city, "i"),
                    "annotation.aggregateRating.ratingValue": {$gte: numVal}
                }).then((data) => {
                db.find(this.queryBuilder.buildRatingFilter(thingType, city, HelperMethods.ensureNumber(numVal))).then((data) => {
                    if (data.length > 0) {

                        let sorted = HelperMethods.prepareAndSortHotels(data);
                        Logger.log(CURRENT_FILE,"Save ListHotels with length: " + data.length);
                        app.db().save("listHotels", HelperMethods.extractFrom(sorted), (err) => {
                        	//save formatted output
                        	app.db().save("formattedOutput", HelperMethods.formatOutputStructuredSave(sorted, "", data.length,thingType), (err) => {
                        		// reset page count
            			    	app.db().save("pageCount", 0, (err) => {
            			    		outputFunction(HelperMethods.formatOutput(sorted.slice(0, Constants.TOP_N), '', data.length,thingType));
            			    	});
                        	})
                        })
                    }
                    else {
                    	Logger.log(CURRENT_FILE,"No hotels found with rating >= "+numVal);
                        outputFunction("I'm sorry, I couldn't find any match.");
                    }
                })
            } else {
            	Logger.warn(CURRENT_FILE,"Filter '"+filterType+"' is invalid");
                outputFunction("I'm sorry, I couldn't recognize this kind of filter.");
            }
        }else{
        	Logger.log(CURRENT_FILE,"No filter defined, searching for things with type '"+thingType);
            db.find(this.queryBuilder.buildGeneralFilter(thingType, city)).then((data) => {
                if (data.length > 0) {

                	Logger.log(CURRENT_FILE,"Save ListHotels with length: " + data.length);

                    let resultString ='I found the following '+ thingType+ ' :  ';
                    for(let counter = 0; counter < data.length && counter < Constants.TOP_N; counter++){
                        resultString = resultString + data[counter].annotation.name + ", ";
                    }

                    app.db().save("listHotels", data, (err) => {
                      //save formatted output
                    	app.db().save("formattedOutput", HelperMethods.formatOutputStructuredDefault(data,thingType), (err) => {
                    		// reset page count
        			    	app.db().save("pageCount", 0, (err) => {
        			    		outputFunction(resultString);
        			    	});
                    	})
                    })
                }
                else {
                	Logger.warn(CURRENT_FILE,"Nothing found of type '"+thingType+"'?");
                    outputFunction("I'm sorry, I couldn't find any match.");
                }
            })
        }

    }



}

module.exports = HotelFilterHandler;
