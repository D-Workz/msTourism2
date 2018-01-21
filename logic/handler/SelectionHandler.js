const path = require('path');
let CURRENT_FILE = path.basename(__filename);
const Logger = require('./../Logger');

const StringConstants = require("./../../config/Constants");
const HotelFilterHandler = require('./HotelFilterHandler');

class SelectionHandler {

    constructor() {

    }

    doFulfillCitySelection(app, db) {


        let ordinal = app.inputs.ordinal;
        let city = app.inputs.city;

        if((!city || city === '') &&( !ordinal || ordinal === '0')){
            app.ask('Input incorrect!');
        }else if((!city || city === '')){

            if (ordinal && ordinal === 1 || ordinal === "1") {
                city = 'Seefeld';
            } else {
                city = 'Mayrhofen';
            }
        }

        app.db().save("city", city, (err) => {
            Logger.log(CURRENT_FILE,"Attribute 'city' set with content of '" + city + "'");
            app.followUpState("SelectTypeState")
            if( ordinal && ordinal === 1 || ordinal === "1"){
                city = 'Seefeld';
            } else {
                city = 'Mayrhofen';
            }
        });


        app.db().save("city", city, (err) => {
            console.log("Attribute 'city' set with content of '" + city + "'");
            app.followUpState("SelectTypeState")
                  .ask(city +" is an interesting place, with a lot to offer. There are " + StringConstants.AVAILABLE_TYPE +" About what do you want to talk?", StringConstants.INTEND_TYPE_SELECTION);
        });


    }

    doFulfillTypeSelection(app, db) {

        Logger.log(CURRENT_FILE,'TypeSelection');

        let ordinal = app.inputs.ordinal;
        let things = app.inputs.things;

        let returnQuery = StringConstants.INTEND_TYPE_SELECTION;
        if(!ordinal && !things){
            app.followUpState("SelectTypeState")
                .ask( returnQuery, StringConstants.INFO_NOT_UNDERSTAND + StringConstants.INTEND_TYPE_SELECTION);
        }else {

            app.db().load('city', (err, city) => {
                let type;
                if (ordinal) {
                    switch (ordinal) {
                        case "1":
                            type = "Hotel";
                            break;
                        case "2":
                            type = "Store";
                            break;
                        case "3":
                            type = "Restaurant";
                            break;
                        case "4":
                            type = 'TouristAttraction';
                            break;
                        case "5":
                            type = 'SkiResort';
                            break;
                        case "6":
                            type = 'BarOrPub';
                            break;
                        case "7" :
                            type = 'BankOrCreditUnion';
                            break;
                        case "8":
                            type = 'Museum';
                            break;
                        case "9":
                            type = 'TrainStation';
                            break;
                        default:
                            type = "Hotel";
                            break;

                    }
                } else {
                    type = things;
                }


                app.db().save("type", type, (err) => {
                    Logger.log(CURRENT_FILE,"Attribute 'type' set with content of '" + type + "'");

                    let numVal = 1;

                   let hotelFilterHandler = new HotelFilterHandler();

                    hotelFilterHandler.searchAndFilter(app, db, numVal, city, "rating", type, (resultString) => {
                        Logger.log(CURRENT_FILE,"Hotel search result: " + resultString);
                        app
                            .followUpState("SelectThingState")
                            .ask(resultString, StringConstants.INFO_NOT_UNDERSTAND + resultString);
                    });

                });


            })
        }

    }

    doFulfillThingSelection(app, db) {


        Logger.log(CURRENT_FILE,'Selection');


        let ordinal = app.inputs.ordinal - 1;

        app.db().load("listHotels", (err, data) => {
            app.db().load("pageCount", (errPageCount, pageCount) => {
            	let calculatedIndex = (StringConstants.TOP_N*(pageCount))+ordinal;
            	
            	Logger.log(CURRENT_FILE, "Calculated index: "+calculatedIndex+", pageCount: "+pageCount+", ordinal: "+ordinal);

            	if(calculatedIndex>data.length-1){
                    Logger.warn(CURRENT_FILE,"Index "+calculatedIndex+" is higher than last index of array ("+(data.length-1)+"). Setting to 0.");            		
            		calculatedIndex=0;
            	}
            	
                Logger.log(CURRENT_FILE,'Selected : ' + data[calculatedIndex].annotation.name + ' has been found now');
                
	            app.db().save("selectedHotel", data[calculatedIndex], (err) => {
	                Logger.log(CURRENT_FILE,'Selected : ' + data[calculatedIndex].annotation.name + ' is now saved to bd');
	                app
	                    .followUpState("ThingKnownState")
	                    .ask('Selected : ' + data[calculatedIndex].annotation.name + ". "+StringConstants.INFO_POSSIBILITIES_HOTEL +" Or ask me whats nearby.", StringConstants.INFO_NOT_UNDERSTAND + data[calculatedIndex].annotation.name + ". "+StringConstants.INFO_POSSIBILITIES_HOTEL +" Or ask me whats nearby");
	            });
            });

            Logger.log(CURRENT_FILE,'HotelSelectionAfterListHandler');
            // if (hotelName && hotelName != '') {
            //
            //     db.mfindOne({type: /Hotel/, "annotation.name": new RegExp(hotelName, "i")}).then((data) => {
            //
            //         app.db().load("selectedHotel", data, (err) => {
            //             Logger.log(CURRENT_FILE,"Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
            //             app.ask("What do you want to know? I can give you a description, a rating, information about rooms, prices, the address, contact infos and how far away it is from the city center.");
            //         });
            //     });
            // }
        });

    }
}

module.exports = SelectionHandler;
