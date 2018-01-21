const path = require('path');
let CURRENT_FILE = path.basename(__filename);
const Logger = require('./../Logger');

const StringConstants = require("./../../config/Constants");

class HotelSelectionAfterListHandler {

    constructor() {

    }

    doFulfill(app, db) {


        let ordinal = app.inputs.ordinal - 1;

        app.db().load("listHotels", (err, data) => {
            Logger.log(CURRENT_FILE,'Selected : ' + data[ordinal].annotation.name + ' has been found now');

            app.db().save("selectedHotel", data[ordinal], (err) => {
                Logger.log(CURRENT_FILE,'Selected : ' + data[ordinal].annotation.name + ' is now saved to bd');
                app
                    .followUpState("ThingKnownState")
                    .ask('Selected : ' + data[ordinal].annotation.name + ". "+StringConstants.INFO_POSSIBILITIES_HOTEL +" Or ask me whats nearby.", StringConstants.INFO_NOT_UNDERSTAND + data[ordinal].annotation.name + ". "+StringConstants.INFO_POSSIBILITIES_HOTEL +" Or ask me whats nearby");
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

module.exports = HotelSelectionAfterListHandler;
