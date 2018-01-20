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


            'Default Welcome Intent': function () {
                app
                    .followUpState("SelectCityState")
                    .ask(StringConstants.INTEND_WELCOME, StringConstants.INFO_NOT_UNDERSTAND + StringConstants.INTEND_CHOOSE_CITY);
            },

            'Unhandled':function () {
              console.log('global unhandled');
              app.ask(StringConstants.UNHANDLED_GLOBAL_STATE_TEXT);
            },

            'TemporaryListState':{
                'HotelFilterWithoutContext': function () {
                    handlers.hotelFilterHandler.doFulfill(app,Annotations);
                },
                'HotelDescriptionWithContext': function () {
                    console.log('HotelDescriptionWithContext');
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
                'ChangeTypeIntent': function () {
                    handlers.changeTypeHandler.doFulfill(app,Annotations);
                },
                'Unhandled':function () {
                    console.log('global unhandled');
                    app.ask(StringConstants.UNHANDLED_TEMPORARY_LIST_STATE_TEXT);
                },
            },

            'SelectCityState': {
                'Selection': function () {
                    handlers.selectionHandler.doFulfillCitySelection(app, Annotations);
                },
                'Unhandled':function () {
                    console.log('SelectCityState unhandled');
                    app.ask(StringConstants.UNHANDLED_SELECT_CITY_STATE_TEXT);
                   // app.ask(StringConstants.INFO_TELL_YOU_ABOUT_CONTEXT + StringConstants.AVAILABLE_TYPE +".", StringConstants.INTEND_TYPE_SELECTION);
                },

            },

            'SelectTypeState':{
                'Selection': function () {
                    handlers.selectionHandler.doFulfillTypeSelection(app,Annotations);
                },
                'Unhandled':function () {
                    console.log('SelectTypeState unhandled');
                    app.ask(StringConstants.UNHANDLED_SELECT_TYPE_STATE_TEXT);
                },
            },

            'SelectThingState':{
                'Selection': function () {
                    handlers.selectionHandler.doFulfillThingSelection(app,Annotations);
                },
                'ListPagingIntent': function () {
                    handlers.listPagingHandler.doFulfill(app, Annotations,"SelectThingState");
                },
                'ChangeTypeIntent': function () {
                    handlers.changeTypeHandler.doFulfill(app,Annotations);
                },
                'Unhandled':function () {
                    console.log('SelectThingState unhandled');
                    app.ask(StringConstants.UNHANDLED_SELECT_THING_STATE_TEXT);
                },

            },

            'ThingKnownState':{
                'ChangeTypeIntent': function () {
                    handlers.changeTypeHandler.doFulfill(app,Annotations);
                },
                'HotelFilterWithoutContext': function () {
                    handlers.hotelFilterHandler.doFulfill(app,Annotations);
                },
                'HotelDescriptionWithContext': function () {
                    console.log('HotelDescriptionWithContext');
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
                'Unhandled':function () {
                    console.log('ThingKnownState unhandled');
                    app.ask(StringConstants.UNHANDLED_THING_KNOW_STATE);
                },

                'ListPagingIntent': function () {
                    handlers.listPagingHandler.doFulfill(app, Annotations,"ThingKnownState");
                }
            },

        };
    }

}


module.exports = Logic;