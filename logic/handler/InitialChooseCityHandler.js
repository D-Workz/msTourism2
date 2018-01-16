const StringConstants = require("./../../config/Constants");

class InitialChooseCityHandler {

    constructor() {

    }

    doFulfill(app, db) {

        let ordinal = app.inputs.ordinal;

        let city;
        if (ordinal && ordinal === 1) {
            city = 'Seefeld';
        } else {
            city = 'Mayrhofen';
        }
        app.db().save("city", city, (err) => {
            console.log("Attribute 'city' set with content of '" + city + "'");
            app.ask("In "+ city +" " + StringConstants.INFO_TELL_YOU_ABOUT_CONTEXT + StringConstants.AVAILABLE_TYPE +".");
        });

    }
}

module.exports = InitialChooseCityHandler;
