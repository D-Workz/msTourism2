class HotelSelectionHandler {

    constructor() {

    }

    doFulfill(app, db) {

        let hotelName = app.inputs.hotelName;
        if (hotelName && hotelName != '') {

            db.mfindOne({type: /Hotel/, "annotation.name": new RegExp(hotelName, "i")}).then((data) => {

                app.db().save("selectedHotel", data, (err) => {
                    console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
                    app.ask("What do you want to know? I can give you a description, a rating, information about rooms, prices, the address, contact infos and how far away it is from the city center.");
                });
            });
        }
    }
}

module.exports = HotelSelectionHandler;
