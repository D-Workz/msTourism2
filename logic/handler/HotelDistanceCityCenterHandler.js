const StringConstants = require("./../../config/Constants");

class HotelDistanceCityCenterHandler {

    constructor() {

    }

    doFulfill(app, db) {
        console.log('HotelDistanceCityCenterHandler');
        app.db().load("selectedHotel", (err, data) => {

            let website = data.website;

            let distance = 0;

            let latCityCenter = 0;
            let longCityCenter = 0;
            let isFromMayrhofen = (website == 'MayrhofenAt') || (website == 'MapsMayrhofenAt');
            let isFromSeefeld = (website =='SeefeldAt')||(website = 'MapsSeefeldAt');

            if( isFromMayrhofen || Array.isArray(website) &&  (arrayContains('MayrhofenAt',website) || arrayContains('MapsMayrhofenAt',website))){
                longCityCenter = 11.866667;
            latCityCenter = 47.166667;
            }else if(isFromSeefeld || Array.isArray(website) && (arrayContains('SeefeldAt',website) || arrayContains('MapsSeefeld', website))){
                longCityCenter = 11.189167;
                latCityCenter = 47.329444;
            }

            let latHotel = data.annotation.geo.latitude;
            let longHotel = data.annotation.geo.longitude;
            if(latHotel && longHotel) {
                distance = distanceCalc(latHotel, longHotel, latCityCenter, longCityCenter);
                console.log("Distance: "+distance.toFixed(2));
                if(distance <100){
                    app
                        .followUpState("ThingKnownState")
                        .ask("Distance to city center: "+distance.toFixed(2) + "km", StringConstants.INFO_NOT_UNDERSTAND);
                }else {
                    app
                        .followUpState("ThingKnownState")
                        .ask("Distance to city center could not be calculated",StringConstants.INFO_NOT_UNDERSTAND);
                }
            }else{
                app
                    .followUpState("ThingKnownState")
                    .ask("No geo coordinates given for this Hotel.",StringConstants.INFO_NOT_UNDERSTAND);
            }
});
    }

}

function distanceCalc(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}

module.exports = HotelDistanceCityCenterHandler;
