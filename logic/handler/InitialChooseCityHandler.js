
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
            app.ask("I can tell you about all sort of things in "+ city + ", like Hotels, Restaurants, Bars and Pubs, Museums or Touristic Attractions.");
        });

    }
}

module.exports = InitialChooseCityHandler;
