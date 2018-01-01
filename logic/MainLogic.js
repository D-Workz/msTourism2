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

const Annotations = mongoose.model('Annotation');

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
                app.tell('Hello hhhhhhhhhsds World!');
            },

            'ListHotels': function () {
            	// handlers.allHotelsHandler.doFulfill(app,Annotations);
                intendListHotels(app);
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
                intendHotelDescriptionWithoutContext(app);
            },

            'HotelRoomsWithContext': function () {
            	handlers.hotelRoomsHandler.doFulfill(app,Annotations);
            	//intendHotelRoomsWithContext(app);
            },

            'HotelRoomsWithoutContext': function () {
                intendHotelRoomsWithoutContext(app);
            },

            'HotelBedsWithContext': function () {
            	handlers.hotelBedsHandler.doFulfill(app,Annotations);
                //intendHotelBedsWithContext(app);
            },

            'HotelBedsWithoutContext': function () {
                intendHotelBedsWithoutContext(app);
            },

            'HotelStarsWithContext': function () {
            	handlers.hotelRatingHandler.doFulfill(app,Annotations);
                //intendHotelStarsWithContext(app);
            },

            'HotelStarsWithoutContext': function () {
                intendHotelStarsWithoutContext(app);
            },

            'HotelPriceWithContext': function () {
            	handlers.hotelPriceHandler.doFulfill(app,Annotations);
                //intendHotelStarsWithContext(app);
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

function intendListHotels(app) {
    let query = {type:/Hotel/, name:"Schweizerhof"};
    Annotations.mfindOne(query).then(function (result) {
        console.log(result);
    })
}

module.exports = Logic;

