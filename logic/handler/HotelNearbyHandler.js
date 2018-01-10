

class HotelNearbyHandler{
	
	constructor(){

	}
	
	doFulfill(app,db, geospatialDb){
		var hotelName = app.inputs.selectedHotelName;
		
		app.ask("TODO: nearby-query here");
	}		
}

module.exports = HotelNearbyHandler;
