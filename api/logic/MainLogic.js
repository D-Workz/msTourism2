// =================================================================================
// App Logic
// =================================================================================
const config = require('config');
const app = require('jovo-framework').Jovo;
const mongoose = require('mongoose');
mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/Annotation');

const Annotations = mongoose.model('Annotation');


class Logic {
    constructor() {
    }

    static getHandlers() {
        return {
            'LAUNCH': function () {
                app.toIntent('HelloWorldIntent');
            },

            'HelloWorldIntent': function () {
                app.tell('Hello hhhhhhhhhsds World!');
            },

            'ListHotels': function () {
                intendListHotels(app);
            },

            'HotelDescriptionWithoutContext': function () {
                intendHotelDescriptionWithoutContext(app);
            },

            'HotelRoomsWithoutContext': function () {
                intendHotelRoomsWithoutContext(app);
            },

            'HotelBedsWithoutContext': function () {
                intendHotelBedsWithoutContext(app);
            },

            'HotelStarsWithoutContext': function () {
                intendHotelStarsWithoutContext(app);
            },
            'HotelNameKnownState': {
                'HotelDescriptionWithContext': function () {
                    intendHotelDescriptionWithContext(app);
                },
                'HotelRoomsWithContext': function () {
                    intendHotelRoomsWithContext(app);
                },
                'HotelBedsWithContext': function () {
                    intendHotelBedsWithContext(app);
                },
                'HotelStarsWithContext': function () {
                    intendHotelStarsWithContext(app);
                },

            }

        };
    }

}

function intendHotelStarsWithoutContext(app) {
    app.followUpState('HotelNameKnownState').tell("Done hotel stars without context!");
}

function intendHotelStarsWithContext(app) {
    app.tell("Done hotel stars with context!");
}


function intendHotelBedsWithoutContext(app) {
    app.followUpState('HotelNameKnownState').tell("Done hotel beds without context!");
}

function intendHotelBedsWithContext(app) {
    app.tell("Done hotel beds with context!");
}

function intendHotelRoomsWithoutContext(app) {
    app.followUpState('HotelNameKnownState').tell("Done hotel rooms without context!");
}

function intendHotelRoomsWithContext(app) {
    //  var villages = app.inputs["hotelName"];
    app.tell("Done hotel rooms with context! + ");
}

function intendHotelDescriptionWithoutContext(app) {
    let hotelName = app.inputs['hotelName']
    app.setSessionAttribute('hotelName', hotelName);
    findAndTellDescriptionForHotelName(app, hotelName);
}

function intendHotelDescriptionWithContext(app) {
    let hotelName = app.getSessionAttribute("hotelName");
    findAndTellDescriptionForHotelName(app, hotelName);
}

function findAndTellDescriptionForHotelName(app, hotelName) {
    MapsMayrhofen.findOne({type: "Hotel"})
        .then(function (hotelObject) {
            for (let i = 0; i < hotelObject.annotations.length; i++) {
                let name = hotelObject.annotations[i].annotation.name;

                if (hotelName === name) {
                    let desc = hotelObject.annotations[i].annotation.description;
                    app.followUpState('HotelNameKnownState').tell(hotelName + ":      " + desc);
                }
            }
        })
}

function intendListHotels(app) {
    Annotations
        .findOne({type: "Hotel"})
        .then(function (hotelObject) {
            let maxBoundry = 0;
            let responseMsg = "";
            let foundAnnotations = [];
            let addressLocality;
            for (let k = 0; k < hotelObject.annotations.length; k++) {
                let annotationAddressLocality;
                try {
                    annotationAddressLocality = hotelObject.annotations[k].annotation.address.addressLocality;
                } catch (err) {
                    console.warn("Cant get address Locality");
                }
                if (annotationAddressLocality) {
                    if (app.inputs["villages"] !== "") {
                        addressLocality = app.inputs["villages"];
                    } else if (app.inputs.villages !== "") {
                        addressLocality = app.inputs.villages;
                    } else {
                        app.tell('Name a place.');
                        return;
                    }
                    if (annotationAddressLocality === addressLocality) {
                        foundAnnotations.push(hotelObject.annotations[k].annotation);
                    }
                }
            }
            if (foundAnnotations.length <= app.inputs.number) {
                maxBoundry = foundAnnotations.length;
            } else {
                maxBoundry = app.inputs.number;
            }

            for (let i = 0; i < maxBoundry; i++) {
                responseMsg += foundAnnotations[i].name + ", "
            }

            app.tell('We found: ' + hotelObject.count + " Hotels in our Database. There are in " + addressLocality + " there are" + foundAnnotations.length + " in total. And the top: " + maxBoundry + " Hotelnames are: " + responseMsg);
        });
}

module.exports = Logic;

