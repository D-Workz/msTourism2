class HotelSelectionHandler {

    constructor() {

    }

    doFulfill(app, db) {
        let hotelName = app.inputs.selectedHotelName;

        db.mfindOne({type: /Hotel/, "annotation.name": new RegExp(hotelName, "i")}).then((data) => {
            app.db().save("selectedHotel", data, (err) => {
                console.log("Attribute 'selectedHotel' set with content of '" + entry.annotation.name + "'");
            });
        });
    }
}

module.exports = HotelSelectionHandler;
