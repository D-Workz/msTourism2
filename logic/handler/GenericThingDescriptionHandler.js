class GenericThingDescriptionHandler {

    constructor() {

    }

    doFulfill(app, db) {
        var hotelName = app.inputs.thingName;

        db.mfindOne({"annotation.name": new RegExp(hotelName, "i")}).then((data) => {
            let descriptionArr = data.annotation.description;
            let descriptionText = "";
            descriptionArr.forEach((descEntry) => {
                descriptionText += descEntry + ". ";
            });
            app.ask("Alright here comes the description: " + descriptionText);
        });
    }
}

module.exports = GenericThingDescriptionHandler;
