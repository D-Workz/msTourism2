const NR_OF_HOTELS_TO_RETURN = 5;
const StringConstants = require("./../../config/Constants");

class HotelFilterHandler {

    constructor() {

	}
	
	doFulfill(app,db){
		
		let numVal = app.inputs.numVal;
		if(!numVal || numVal ===0  ) {numVal = 1}
		let filterType = app.inputs.filter;
		//if(filterType){}
        let that = this;


		app.db().load("type",(err,type) => {

            app.db().load("city", (err, city) => {
                if (type) {
                    if (type.toLowerCase() === "hotel") {
                        that.searchAndFilter(app, db, numVal, city, filterType, type, (resultString) => {
                            app.ask(resultString);
                        });
                    } else {
                        that.searchAndFilter(app, db, numVal, city, filterType, type, (resultString) => {
                            app.ask(resultString);
                    });
                    }
                } else {
                    app.ask(StringContsants.NO_TYPE_DEFINED);
                }
            });
        });



    }

    searchAndFilter(app, db, numVal, city, filterType, thingType, outputFunction) {
        let that = this;

        if (thingType === 'Hotel') {
                if (filterType === "price") {
                if(!numVal || numVal ===0 || numVal <0  ) {numVal = 1000}
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
                        console.log("Save ListHotels with length: " + data.length);

                        app.db().save("listHotels", that.extractFrom(sorted).slice(0, NR_OF_HOTELS_TO_RETURN), (err) => {
                            outputFunction(that.formatOutput(sorted.slice(0, NR_OF_HOTELS_TO_RETURN), "EUR", data.length,thingType));
                        })
                    } else {
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
                    if (data.length > 0) {

                        let sorted = that.prepareAndSortHotels(data);
                        console.log("Save ListHotels with length: " + data.length);
                        app.db().save("listHotels", that.extractFrom(sorted).slice(0, NR_OF_HOTELS_TO_RETURN), (err) => {
                            outputFunction(that.formatOutput(sorted.slice(0, NR_OF_HOTELS_TO_RETURN), '', data.length,thingType));
                        })
                    } else {
                        outputFunction("I'm sorry, I couldn't find any Hotel for this rating.");
                    }
                })
            } else {
                outputFunction("I'm sorry, I couldn't recognize this kind of filter.");
            }
        }else{
            db.find({
                type: new RegExp(thingType, "i"),
                website: new RegExp(city, "i")}).then((data) => {
                if (data.length > 0) {


                    console.log("Save ListHotels with length: " + data.length);

                    let resultString ='I found the following '+ thingType+ ' :  ';
                    for(let counter = 0; counter < data.length && counter < NR_OF_HOTELS_TO_RETURN; counter++){
                        resultString = resultString + data[counter].annotation.name + ", ";
                    }

                    app.db().save("listHotels", data.slice(0, NR_OF_HOTELS_TO_RETURN), (err) => {
                        outputFunction(resultString);
                    })
                }
                else {
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
        })

        arr.sort((a, b) => {
            if (a.val < b.val) {
                return -1;
            } else if (a.val > b.val) {
                return 1;
            }
            return 0;
        })
        return arr;
    }

    formatOutput(data, currency, hitsInTotal,thingtype) {
        let returnString = "I found the following " + thingtype + ": ";
        data.forEach((entry) => {
            returnString += entry.entry.annotation.name + " (" + entry.val + (currency !== "" ? " " + currency : "") + "), ";
        })
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
