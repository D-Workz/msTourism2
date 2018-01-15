const StringConstants = require("./../../config/Constants");

class HotelSelectionAfterListHandler {

    constructor() {

    }

    doFulfill(app, db) {


        let ordinal = app.inputs.ordinal - 1;

        app.db().load("listHotels", (err, data) => {
            console.log('Selected : ' + data[ordinal].annotation.name + ' has been found now');

            app.db().save("selectedHotel", data[ordinal], (err) => {
                console.log('Selected : ' + data[ordinal].annotation.name + ' is now saved to bd');
                app.ask('Selected : ' + data[ordinal].annotation.name);
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

module.exports = HotelSelectionAfterListHandler;
