// =================================================================================
// App Logic
// =================================================================================
const config = require('config');
const app = require('jovo-framework').Jovo;
const mongoose = require('mongoose');
mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
require('../model/MapsMayrhofen');
require('../model/MapsSeefeld');
require('../model/MayrhofenAt');
require('../model/SeefeldAt');

const MapsMayrhofen = mongoose.model('MapsMayrhofen');
const MapsSeefeld = mongoose.model('MapsSeefeld');
const SeefeldAt = mongoose.model('SeefeldAt');
const MayrhofenAt = mongoose.model('MayrhofenAt');


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
            'HotelDescriptionWithContext': function () {
                intendHotelDescriptionWithContext(app);
            },
            'HotelDescriptionWithoutContext': function () {
                intendHotelDescriptionWithoutContext(app);
            },
            'HotelRoomsWithContext': function () {
                intendHotelRoomsWithContext(app);
            },
            'HotelRoomsWithoutContext': function () {
                intendHotelRoomsWithoutContext(app);
            },
            'HotelBedsWithContext': function () {
                intendHotelBedsWithContext(app);
            },
            'HotelBedsWithoutContext': function () {
                intendHotelBedsWithoutContext(app);
            },
            'HotelStarsWithContext': function () {
                intendHotelStarsWithContext(app);
            },
            'HotelStarsWithoutContext': function () {
                intendHotelStarsWithoutContext(app);
            }
        };
    }

}

function intendHotelStarsWithoutContext(app){
    app.tell("Done hotel stars without context!" );
}

function intendHotelStarsWithContext(app){
    app.tell("Done hotel stars with context!" );
}


function intendHotelBedsWithoutContext(app){
    app.tell("Done hotel beds without context!" );
}

function intendHotelBedsWithContext(app){
    app.tell("Done hotel beds with context!" );
}

function intendHotelRoomsWithoutContext(app){
    app.tell("Done hotel rooms without context!" );
}

function intendHotelRoomsWithContext(app){
    app.tell("Done hotel rooms with context!" );
}

function intendHotelDescriptionWithoutContext(app){
    app.tell("Done hotel desc without context!" );
}

function intendHotelDescriptionWithContext(app) {

    app.tell("Done hotel desc with context!" );
}

function intendListHotels(app) {
    MapsMayrhofen
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

