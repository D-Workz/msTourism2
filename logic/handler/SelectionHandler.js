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
            console.log("Attribute 'city' set with content of '" + city + "'");
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
                  .ask("In "+ city +" " + StringConstants.INFO_TELL_YOU_ABOUT_CONTEXT + StringConstants.AVAILABLE_TYPE +".", StringConstants.INTEND_TYPE_SELECTION);
        });


    }

    doFulfillTypeSelection(app, db) {

        console.log('TypeSelection');

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
                    console.log("Attribute 'type' set with content of '" + type + "'");

                    let numVal = 1;

                   let hotelFilterHandler = new HotelFilterHandler();

                    hotelFilterHandler.searchAndFilter(app, db, numVal, city, "rating", type, (resultString) => {
                        console.log("Hotel search result: " + resultString);
                        app
                            .followUpState("SelectThingState")
                            .ask(resultString, StringConstants.INFO_NOT_UNDERSTAND + resultString);
                    });

                });


            })
        }

    }

    doFulfillThingSelection(app, db) {


        console.log('Selection');


        let ordinal = app.inputs.ordinal - 1;

        app.db().load("listHotels", (err, data) => {
            console.log('Selected : ' + data[ordinal].annotation.name + ' has been found now');

            app.db().save("selectedHotel", data[ordinal], (err) => {
                console.log('Selected : ' + data[ordinal].annotation.name + ' is now saved to bd');
                app
                    .followUpState("ThingKnownState")
                    .ask('Selected : ' + data[ordinal].annotation.name + ". "+StringConstants.INFO_POSSIBILITIES_HOTEL +" Or ask me whats nearby.", StringConstants.INFO_NOT_UNDERSTAND + data[ordinal].annotation.name + ". "+StringConstants.INFO_POSSIBILITIES_HOTEL +" Or ask me whats nearby");
            });

            console.log('HotelSelectionAfterListHandler');
            // if (hotelName && hotelName != '') {
            //
            //     db.mfindOne({type: /Hotel/, "annotation.name": new RegExp(hotelName, "i")}).then((data) => {
            //
            //         app.db().load("selectedHotel", data, (err) => {
            //             console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
            //             app.ask("What do you want to know? I can give you a description, a rating, information about rooms, prices, the address, contact infos and how far away it is from the city center.");
            //         });
            //     });
            // }
        });

    }
}

module.exports = SelectionHandler;
