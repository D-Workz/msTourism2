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
    constructor() {}

   static getHandlers(){
        return {
            'LAUNCH': function () {
                app.toIntent('HelloWorldIntent');
            },

            'HelloWorldIntent': function () {
                app.tell('Hello hhhhhhhhh World!');
            },

            'ListHotels': function () {
                intendListHotels(app);
            }
        };
    }

}

function intendListHotels(app){
    MapsMayrhofen
        .findOne({type:"Hotel"})
        .then(function (hotelObject) {
            app.tell('We found: '+ hotelObject.count + " Hotels in our Database.");
        });
}

module.exports = Logic;

