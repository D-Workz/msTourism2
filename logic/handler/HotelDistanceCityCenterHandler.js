
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

            if(Array.isArray(website) &&
                (arrayContains('MayrhofenAt',website) || arrayContains('MapsMayrhofenAt',website))){
            longCityCenter = 11.866667;
            latCityCenter = 47.166667;
            }else if(Array.isArray(website) && (arrayContains('SeefeldAt',website) || arrayContains('MapsSeefeld', website))){
                longCityCenter = 11.189167;
                latCityCenter = 47.329444;
            }

            let latHotel = data.annotation.geo.latitude;
            let longHotel = data.annotation.geo.longitude;
            if(latHotel && longHotel) {
                distance = distanceCalc(latHotel, longHotel, latCityCenter, longCityCenter);
                console.log("Distance: "+distance.toFixed(2));
                app.ask("Distance to city center: "+distance.toFixed(2) + "km");
            }else{
                app.ask("No geo coordinates given for this Hotel.");
            }
});
    }

}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
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
