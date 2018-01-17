// =================================================================================
// App Logic
// =================================================================================
const config = require('config');
const app = require('jovo-framework').Jovo;
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const StringConstants = require("./../config/Constants");

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
                app.toIntent('Default Welcome Intent');
              //  app.ask('Hej there, do you want me to tell you about the Hotels in Seefeld or Mayrhofen? Say first or second to choose one of them');
            },

            'HelperStatusIntent': function () {
                handlers.helperHandler.doFulfill(app,Annotations);
            },
            'FUNcreditsIntent': function () {
                handlers.funCreditHandler.doFulfill(app,Annotations);
            },    
            'FUNsoundIntent': function () {
                handlers.funSoundHandler.doFulfill(app,Annotations);
            },              
            'ChangeCityIntent': function () {
                handlers.changeCityHandler.doFulfill(app,Annotations);
            },
            'ChangeTypeIntent': function () {
                handlers.changeTypeHandler.doFulfill(app,Annotations);
            },

            'Default Welcome Intent': function () {
                app
                    .followUpState("SelectCityState")
                    .ask(StringConstants.INTEND_WELCOME, StringConstants.INFO_NOT_UNDERSTAND + StringConstants.INTEND_CHOOSE_CITY);
            },

            'AfterNearbyState':{
                'HotelFilterWithoutContext': function () {
                    handlers.hotelFilterHandler.doFulfill(app,Annotations);
                },
                'HotelDescriptionWithContext': function () {
                    handlers.hotelDescriptionHandler.doFulfill(app,Annotations);
                },

                'HotelRoomsWithContext': function () {
                    handlers.hotelRoomsHandler.doFulfill(app, Annotations);
                },

                'HotelBedsWithContext': function () {
                    handlers.hotelBedsHandler.doFulfill(app, Annotations);
                },

                'HotelStarsWithContext': function () {
                    handlers.hotelRatingHandler.doFulfill(app, Annotations);
                },

                'HotelPriceWithContext': function () {
                    handlers.hotelPriceHandler.doFulfill(app, Annotations);
                },

                'HotelSendImagesWithContext': function () {
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
                'Selection': function () {
                    handlers.hotelSelectionAfterListHandler.doFulfill(app,Annotations);
                },
            },

            'SelectCityState': {
                'Selection': function () {
                    handlers.selectionHandler.doFulfillCitySelection(app, Annotations);
                },

            },

            'SelectTypeState':{
                'Selection': function () {
                    handlers.selectionHandler.doFulfillTypeSelection(app,Annotations);
                },
            },

            'SelectThingState':{
                'Selection': function () {
                    handlers.selectionHandler.doFulfillThingSelection(app,Annotations);
                },
            },

            'ThingKnownState':{
                'HotelFilterWithoutContext': function () {
                    handlers.hotelFilterHandler.doFulfill(app,Annotations);
                },
                'HotelDescriptionWithContext': function () {
                    handlers.hotelDescriptionHandler.doFulfill(app,Annotations);
                },

                'HotelRoomsWithContext': function () {
                    handlers.hotelRoomsHandler.doFulfill(app, Annotations);
                },

                'HotelBedsWithContext': function () {
                    handlers.hotelBedsHandler.doFulfill(app, Annotations);
                },

                'HotelStarsWithContext': function () {
                    handlers.hotelRatingHandler.doFulfill(app, Annotations);
                },

                'HotelPriceWithContext': function () {
                    handlers.hotelPriceHandler.doFulfill(app, Annotations);
                },

                'HotelSendImagesWithContext': function () {
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
            },

        };
    }

}


module.exports = Logic;