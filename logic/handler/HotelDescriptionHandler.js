const StringConstants = require("./../../config/Constants");


class HotelDescriptionHandler {

    constructor() {

    }

    doFulfill(app, db) {

        app.db().load("selectedHotel", (err, data) => {
            let descriptionArr = data.annotation.description;
            if (descriptionArr) {
                let descriptionText = "";

                if (Array.isArray(descriptionArr)) {
                    descriptionArr.forEach((descEntry) => {
                        descriptionText += descEntry + ". ";
                    });
                } else {
                    descriptionText = descriptionArr;
                }
                if (descriptionText !== "") {
                    let responseMessage = "";
                    if(descriptionText.length > 400){
                        responseMessage +="The description is really long. I read you the beginning, if you want I can send you a card, with the full text. ";
                        descriptionText = descriptionText.substring(0, 400);
                        descriptionText += "..."
                    }
                    responseMessage+="Alright here comes the description: ";
                    app
                        .followUpState("ThingKnownState")
                        .ask(responseMessage + descriptionText, StringConstants.INFO_NOT_UNDERSTAND);
                } else {
                    app
                        .followUpState("ThingKnownStat e")
                        .ask("I'm sorry, but the description property is not available.", StringConstants.INFO_NOT_UNDERSTAND)
                }
            } else {
                app
                    .followUpState("ThingKnownState")
                    .ask("I'm sorry, I couldn't find any description.", StringConstants.INFO_NOT_UNDERSTAND);
            }
        });

    }
}

module.exports = HotelDescriptionHandler;
