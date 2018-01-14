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
                // intendListHotels(app);
            },


            'HotelSelectionWithContext': function () {
                handlers.hotelSelectionHandler.doFulfill(app,Annotations);
            },


            'HotelDescriptionWithContext': function () {
            	handlers.hotelDescriptionHandler.doFulfill(app,Annotations);
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

            'HotelDistanceCityCenterWithContext':function () {
                handlers.hotelDistanceCityCenterHandler.doFulfill(app,Annotations);
            },

            'HotelShowCardWithContext': function () {
                handlers.hotelShowCardHandler.doFulfill(app,Annotations);
            },


            'HotelNearbyWithContext': function () {
            	handlers.hotelNearbyHandler.doFulfill(app,Annotations,GeospatialProjections);
            },
            'GenericThingDescription': function () {
            	handlers.genericThingDescriptionHandler.doFulfill(app,Annotations);
            },
            'HotelFilterWithoutContext': function () {
            	handlers.hotelFilterHandler.doFulfill(app,Annotations);
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
    var hotelName = app.inputs.hotelName;
    if(!hotelName){
        hotelName = app.inputs.selectedHotelName;
    }
    if(!hotelName && hotelName!=''){
    db.mfind({type:/Hotel/, "annotation.name": new RegExp(hotelName,"i")}).then((data) => {

        if(Array.isArray(data)) {
            data.forEach((entry) => {
                app.db().save("selectedHotel", data, (err) => {
                    console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
                });
            });

        }else{
            app.db().save("selectedHotel", data, (err) => {
                console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
            });
        }
    });
    }
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
    let query = {type:/Hotel/, name:"Möslalm"}
    Annotations.mfindOne(query).then(function (result) {
        console.log(result);
    })
}

module.exports = Logic;