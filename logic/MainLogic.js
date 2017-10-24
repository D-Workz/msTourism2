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
            let maxBoundry = 0;
            let responseMsg = "";
            let foundAnnotations = [];
            for(let k=0;k<hotelObject.annotations.length;k++){
                let annotationAddressLocality = hotelObject.annotations[k].annotation.address.addressLocality;
                if(annotationAddressLocality === app.inputs["geo-city"]){
                    foundAnnotations.push(hotelObject.annotations[k].annotation);
                }
            }
            if(foundAnnotations.length <= app.inputs.number){
                maxBoundry = foundAnnotations.length;
            }else{
                maxBoundry = app.inputs.number;
            }
            for(let i=0;i<maxBoundry;i++){
               responseMsg += foundAnnotations[i].name + ",\n "
            }
            app.tell('We found: '+ hotelObject.count + " Hotels in our Database in " + app.inputs["geo-city"]+" \nThe top: "+maxBoundry +" Hotelnames are: "+responseMsg);
        });
}

module.exports = Logic;

