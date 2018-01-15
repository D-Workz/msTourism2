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
                app.toIntent('Default Welcome Intent');
              //  app.ask('Hej there, do you want me to tell you about the Hotels in Seefeld or Mayrhofen? Say first or second to choose one of them');
            },


            'Default Welcome Intent': function () {
                app.ask('Hej there, do you want me to tell you about the Hotels in Seefeld or Mayrhofen? Say first or second to choose one of them');
            },

            'InitialChooseCityIntent': function () {
            handlers.initialChooseCityHandler.doFulfill(app,Annotations);
            },

            'ListHotels': function () {
                handlers.allHotelsHandler.doFulfill(app, Annotations);
            },

            'HotelSelectionAfterList': function () {
                handlers.hotelSelectionAfterListHandler.doFulfill(app,Annotations);
            },


            // 'HotelSelectionWithContext': function () {
            //     handlers.hotelSelectionHandler.doFulfill(app,Annotations);
            // },


            'HotelDescriptionWithContext': function () {
            	handlers.hotelDescriptionHandler.doFulfill(app,Annotations);
            },

            // 'HotelDescriptionWithoutContext': function () {
            //     setHotelNameKnown(app, Annotations,handlers.hotelDescriptionHandler.doFulfill() );
            // },

            'HotelRoomsWithContext': function () {
                handlers.hotelRoomsHandler.doFulfill(app, Annotations);
            },

            // 'HotelRoomsWithoutContext': function () {
            //     setHotelNameKnown(app, Annotations,handlers.hotelRoomsHandler.doFulfill());
            // },

            'HotelBedsWithContext': function () {
                handlers.hotelBedsHandler.doFulfill(app, Annotations);
            },

            // 'HotelBedsWithoutContext': function () {
            //     setHotelNameKnown(app, Annotations,handlers.hotelBedsHandler.doFulfill());
            // },

            'HotelStarsWithContext': function () {
                handlers.hotelRatingHandler.doFulfill(app, Annotations);
            },

            // 'HotelStarsWithoutContext': function () {
            //     setHotelNameKnown(app, Annotations,handlers.hotelRatingHandler.doFulfill());
            // },

            'HotelPriceWithContext': function () {
                handlers.hotelPriceHandler.doFulfill(app, Annotations);
            },

            'HotelSendImagesWithContext': function () {
                handlers.hotelImagesHandler.doFulfill(app, Annotations);
            },

            // 'HotelSendImagesWithoutContext': function () {
            //     setHotelNameKnown(app, Annotations,handlers.hotelImagesHandler.doFulfill);
            // },

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
            'HelperStatusIntent': function () {
            	handlers.helperHandler.doFulfill(app,Annotations);
            }
        };
    }

}

function setHotelNameKnown(app,db,functionToCall) {
    let hotelName = app.inputs.hotelName;

    if(hotelName && hotelName!=''){
    db.mfindOne({type:/Hotel/, "annotation.name": new RegExp(hotelName,"i")}).then((data) => {

        if (data) {
            app.db().save("selectedHotel", data, (err) => {
                console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
                functionToCall(app, db);
            });
        }else{
            console.log('Problem with setting Hotel Name');
        }
    });
    }
}



module.exports = Logic;