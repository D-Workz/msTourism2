// =================================================================================
// App Logic
// =================================================================================
const config = require('config');
const app = require('jovo-framework').Jovo;
const bluebird = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = bluebird;

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/Annotation');
require('../model/GeospatialProjection');


const Annotations = mongoose.model('Annotation');
const GeospatialProjections = mongoose.model('GeospatialProjection');

//handler-factory
const HandlerContainer = require('./HandlerContainer');
const handlers = new HandlerContainer();

class Logic {
    constructor() {
    }

    static getHandlers() {
        return {
            'LAUNCH': function () {
                app.toIntent('HelloWorldIntent');
            },

            'HelloWorldIntent': function () {
                app.ask('Hello World Intent!');
            },

            'Default Welcome Intent': function () {
                app.ask('Default Welcome Intent!');
            },

            'ListHotels': function () {
                handlers.allHotelsHandler.doFulfill(app, Annotations);
                //intendListHotels(app);
            },


            'HotelSelectionWithContext': function () {
                console.log("Selected hotel: '"+app.inputs.selectedHotelName+"'");
                handlers.hotelSelectionHandler.doFulfill(app,Annotations);
            },


            'HotelDescriptionWithContext': function () {
            	handlers.hotelDescriptionHandler.doFulfill(app,Annotations);
                //intendHotelDescriptionWithContext(app);
            },

            'HotelDescriptionWithoutContext': function () {
                setHotelNameKnown(app, Annotations);
                handlers.hotelDescriptionHandler.doFulfill(app, Annotations);

            },

            'HotelRoomsWithContext': function () {
                handlers.hotelRoomsHandler.doFulfill(app, Annotations);
            },

            'HotelRoomsWithoutContext': function () {
                setHotelNameKnown(app, Annotations);
                handlers.hotelRoomsHandler.doFulfill(app, Annotations);
            },

            'HotelBedsWithContext': function () {
                handlers.hotelBedsHandler.doFulfill(app, Annotations);
            },

            'HotelBedsWithoutContext': function () {
                setHotelNameKnown(app, Annotations);
                handlers.hotelBedsHandler.doFulfill(app, Annotations);
            },

            'HotelStarsWithContext': function () {
                handlers.hotelRatingHandler.doFulfill(app, Annotations);
            },

            'HotelStarsWithoutContext': function () {
                setHotelNameKnown(app, Annotations);
                handlers.hotelRatingHandler.doFulfill(app, Annotations);
            },

            'HotelPriceWithContext': function () {
                handlers.hotelPriceHandler.doFulfill(app, Annotations);
            },

            'HotelSendImagesWithContext': function () {
                handlers.hotelImagesHandler.doFulfill(app, Annotations);
            },

            'HotelSendImagesWithoutContext': function () {
                setHotelNameKnown(app, Annotations);
                handlers.hotelImagesHandler.doFulfill(app, Annotations);
            },
            'HotelAddressWithContext': function () {
            	handlers.hotelAddressHandler.doFulfill(app,Annotations);
            },            
            'HotelContactWithContext': function () {
            	handlers.hotelContactHandler.doFulfill(app,Annotations);
            },                     
            'HotelNearbyWithContext': function () {
            	handlers.hotelNearbyHandler.doFulfill(app,Annotations,GeospatialProjections);
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

function setHotelNameKnown(app,db) {
    var hotelName = app.inputs.selectedHotelName;

    db.find({type: "Hotel", "annotation.name": hotelName}).limit(1).then((data) => {
        data.forEach((entry) => {
            app.db().save("selectedHotel", entry, (err) => {
                console.log("Attribute 'selectedHotel' set with content of '" + hotelName + "'");
            });
        })
    });
}

    function intendHotelStarsWithoutContext(app) {
    app.followUpState('HotelNameKnownState').ask("Done hotel stars without context!");
}

    function intendHotelStarsWithContext(app) {
    app.ask("Done hotel stars with context!");
}


function intendHotelBedsWithoutContext(app) {
    app.followUpState('HotelNameKnownState').ask("Done hotel beds without context!");
}

function intendHotelBedsWithContext(app) {
    app.ask("Done hotel beds with context!");
}

function intendHotelRoomsWithoutContext(app) {
    app.followUpState('HotelNameKnownState').ask("Done hotel rooms without context!");
}

function intendHotelRoomsWithContext(app) {
    //  var villages = app.inputs["hotelName"];
    app.ask("Done hotel rooms with context! + ");
}

function intendHotelDescriptionWithoutContext(app) {
    let hotelName = app.inputs['hotelName']
    app.setSessionAttribute('hotelName', hotelName);
    findAndaskDescriptionForHotelName(app, hotelName);
}

function intendHotelDescriptionWithContext(app) {
    let hotelName = app.getSessionAttribute("hotelName");
    findAndaskDescriptionForHotelName(app, hotelName);
}

function findAndaskDescriptionForHotelName(app, hotelName) {
    MapsMayrhofen.findOne({type: "Hotel"})
        .then(function (hotelObject) {
            for (let i = 0; i < hotelObject.annotations.length; i++) {
                let name = hotelObject.annotations[i].annotation.name;

                if (hotelName === name) {
                    let desc = hotelObject.annotations[i].annotation.description;
                    app.followUpState('HotelNameKnownState').ask(hotelName + ":      " + desc);
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
                        app.ask('Name a place.');
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

            app.ask('We found: ' + hotelObject.count + " Hotels in our Database. There are in " + addressLocality + " there are" + foundAnnotations.length + " in total. And the top: " + maxBoundry + " Hotelnames are: " + responseMsg);
        });
}

module.exports = Logic;