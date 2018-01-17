const path = require('path');
let CURRENT_FILE = path.basename(__filename);
const Logger = require('./../Logger');

//const GoogleAction = require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction;
//const Carousel =   require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction.Carousel;
//const OptionItem = require('jovo-framework/lib/platforms/googleaction/googleAction').GoogleAction.OptionItem;
const StringConstants = require("./../../config/Constants");

class HotelImagesHandler {

    constructor() {

    }

    doFulfill(app, db) {


        app.db().load("selectedHotel", (err, data) => {

            let image = data.annotation.image;

            if (Array.isArray(image)) {

                for (var counter = 0; counter < 1; counter++) {

                    let imageObject = image[counter];
                    if (imageObject) {
                        let url = imageObject.url;
                        if (url && url != "") {
                            let title = image.caption;
                            if (!title) {
                                title = data.annotation.name;
                            }


                            app.googleAction().showImageCard(title, title, url);
                            app
                                .followUpState("ThingKnownState")
                                .ask('What else would you like to know ?', 'What else would you like to know ?');


                            Logger.log(CURRENT_FILE,"Image url: " + url);
                        } else {
                            Logger.log(CURRENT_FILE,"Image does not contain an url")
                        }

                    } else {
                        // app.ask("I'm terrible sorry, but I could not find the desired information");
                    }
                }


                // app.googleAction().showSuggestionChips(['2','1']);
                // app.googleAction().showCarousel(carousel);
                // app.ask('What else would you like to know ?');

            } else if (image && image.url) {

                let url = image.url;
                if (url && url != "") {
                    let title = image.caption;
                    if (!title) {
                        title = data.annotation.name;
                    }


                    app.googleAction().showImageCard(title, title, url);
                    app
                        .followUpState("ThingKnownState")
                        .ask('What else would you like to know ?', StringConstants.INFO_NOT_UNDERSTAND);

                } else {
                    app.ask('No image available.', StringConstants.INFO_NOT_UNDERSTAND);


                }
            }


       });
    }
}
    module.exports = HotelImagesHandler;
