const path = require('path');
let CURRENT_FILE = path.basename(__filename);

const Constants = require("./../../config/Constants");
const Logger = require('./../Logger');
const HelperMethods = require('./../HelperMethods');

class HotelFilterHandler {

    constructor() {

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
                    if (type.toLowerCase() === "hotel") {
                        that.searchAndFilter(app, db, numVal, city, filterType, type, (resultString) => {
                            app
                                .followUpState("SelectThingState")
                                .ask(resultString, Constants.INFO_NOT_UNDERSTAND + resultString);
                        });
                    } else {
                        that.searchAndFilter(app, db, numVal, city, filterType, type, (resultString) => {
                            app
                                .followUpState("SelectThingState")
                                .ask(resultString, Constants.INFO_NOT_UNDERSTAND + resultString);
                    });
                    }
                } else {
                	Logger.warn(CURRENT_FILE,"No type defined?");
                    app
                        .followUpState("ThingKnownState")
                        .ask(Constants.NO_TYPE_DEFINED, Constants.INFO_NOT_UNDERSTAND);
                }
            });
        });



    }

    searchAndFilter(app, db, numVal, city, filterType, thingType, outputFunction) {
        let that = this;
    	Logger.log(CURRENT_FILE,"Search triggered: {numVal: "+numVal+", city: "+city+", filterType: "+filterType+", thingType: "+thingType+"}");

        if (thingType === 'Hotel') {
            if (filterType === "price") {
                db.find({
                    type: new RegExp(thingType, "i"), website: new RegExp(city, "i"), "annotation.makesOffer": {
                        "$elemMatch": {
                            $and: [{
                                "priceSpecification.minPrice": {$lte: numVal}
                            }, {
                                "priceSpecification.minPrice": {$ne: 0.00}
                            }
                            ]
                        }
                    }
                }).then((data) => {
                    if (data.length > 0) {

                        let sorted = that.prepareAndSortHotelsPricing(data);
                        Logger.log(CURRENT_FILE,"Save ListHotels with length: " + data.length);

                        app.db().save("listHotels", that.extractFrom(sorted).slice(0, Constants.TOP_N), (err) => {
                            outputFunction(that.formatOutput(sorted.slice(0, Constants.TOP_N), "EUR", data.length,thingType));
                        })
                    } else {
                    	Logger.log(CURRENT_FILE,"No hotels found with price <= "+numVal);
                        outputFunction("I couldn't find any hotels according to that price specification.");
                    }
                })
            } else if (filterType === "rating") {
                db.find({
                    type: new RegExp(thingType, "i"),
                    website: new RegExp(city, "i"),
                    "annotation.aggregateRating.ratingValue": {$gte: numVal}
                }).then((data) => {
                    if (data.length > 0) {

                        let sorted = that.prepareAndSortHotels(data);
                        Logger.log(CURRENT_FILE,"Save ListHotels with length: " + data.length);
                        app.db().save("listHotels", that.extractFrom(sorted).slice(0, Constants.TOP_N), (err) => {
                            outputFunction(that.formatOutput(sorted.slice(0, Constants.TOP_N), '', data.length,thingType));
                        })
                    }
                    else {
                    	Logger.log(CURRENT_FILE,"No hotels found with rating <= "+numVal);                    	
                        outputFunction("I'm sorry, I couldn't find any match.");
                    }
                })
            } else {
            	Logger.warn(CURRENT_FILE,"Filter '"+filterType+"' is invalid");
                outputFunction("I'm sorry, I couldn't recognize this kind of filter.");
            }
        }else{
        	Logger.log(CURRENT_FILE,"No filter defined, searching for things with type '"+thingType);
            db.find({
                type: new RegExp(thingType, "i"),
                website: new RegExp(city, "i")}).then((data) => {
                if (data.length > 0) {


                	Logger.log(CURRENT_FILE,"Save ListHotels with length: " + data.length);

                    let resultString ='I found the following '+ thingType+ ' :  ';
                    for(let counter = 0; counter < data.length && counter < Constants.TOP_N; counter++){
                        resultString = resultString + data[counter].annotation.name + ", ";
                    }

                    app.db().save("listHotels", data.slice(0, Constants.TOP_N), (err) => {
                        outputFunction(resultString);
                    })
                }
                else {
                	Logger.warn(CURRENT_FILE,"Nothing found of type '"+thingType+"'?");                	
                    outputFunction("I'm sorry, I couldn't find any match.");
                }
            })
        }

    }

    extractFrom(sortedAndFormatted) {
        let arr = [];
        sortedAndFormatted.forEach((entry) => {
            arr.push(entry.entry);
        })
        return arr;
    }

    prepareAndSortHotels(unsorted) {
        let arr = [];
        unsorted.forEach((entry) => {
            arr.push({entry: entry, val: Number(entry.annotation.aggregateRating.ratingValue)});
        })

        arr.sort((a, b) => {
            if (a.val < b.val) {
                return 1;
            } else if (a.val > b.val) {
                return -1;
            }
            return 0;
        })
        return arr;
    }

    prepareAndSortHotelsPricing(unsorted) {
        let arr = [];
        let that = this;
        unsorted.forEach((entry) => {
            arr.push({entry: entry, val: that.findSmallestPrice(entry)});
        });

        arr.sort((a, b) => {
            if (a.val < b.val) {
                return -1;
            } else if (a.val > b.val) {
                return 1;
            }
            return 0;
        });
        return arr;
    }

    formatOutput(data, currency, hitsInTotal,thingtype) {
        let returnString = "To know more about the five ";
        if(currency!==""){
            returnString += "cheapest " + thingtype + "s: ";
        }else{
            returnString += "best rated " + thingtype + "s: ";
        }
        let i = 0;
        data.forEach((entry) => {
            i++;
            if(currency !==""){
                returnString += "For " + entry.entry.annotation.name + " for " + entry.val +" " + currency + ", say  " +i + ".";
            }else{
                returnString += "For " + entry.entry.annotation.name + " with an rating of " + entry.val +", say "+i+".";
            }
        });
        let additionalText = "";
        if (data.length < hitsInTotal) {
            additionalText = " and " + (hitsInTotal - data.length) + " others."
        }
        return returnString.substr(0, returnString.length - 2) + additionalText;
    }

    findSmallestPrice(hotel) {
        let smallestPrice = Number.MAX_VALUE;
        hotel.annotation.makesOffer.forEach((makesOfferEntry) => {
            if (makesOfferEntry.priceSpecification) {
                makesOfferEntry.priceSpecification.forEach((priceEntry) => {
                    if (priceEntry.minPrice < smallestPrice && priceEntry.minPrice !== 0) {
                        smallestPrice = priceEntry.minPrice;
                    }
                })
            }
        })
        return smallestPrice;
    }

}

module.exports = HotelFilterHandler;
