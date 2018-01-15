const HotelFilterHandler = require('./HotelFilterHandler');

class InitialChooseCityHandler {

    constructor() {

    }

    doFulfill(app, db) {

        let ordinal = app.inputs.ordinal;

        let city;
        if (ordinal && ordinal == 1) {
            city = 'Seefeld';
        } else {
            city = 'Mayrhofen';
        }
        app.db().save("city", city, (err) => {
            console.log("Attribute 'city' set with content of '" + city + "'");
            // app.ask("What do you want to know? I can give you a description, a rating, information about rooms, prices, the address, contact infos and how far away it is from the city center.");
        });

        let numVal = 3;

        this.hotelFilterHandler = new HotelFilterHandler();

            this.hotelFilterHandler.searchAndFilter(app, db, numVal, city, "rating", "Hotel", (resultString) => {
            app.ask(resultString );
        });
    }
}

module.exports = InitialChooseCityHandler;
