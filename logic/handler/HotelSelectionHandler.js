

class HotelSelectionHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
		var hotelName = app.inputs.selectedHotelName;
		
		db.mfindOne({type:/Hotel/, "annotation.name":hotelName}).then((data) =>{
			data.forEach((entry) => {
				app.db().save("selectedHotel", entry, (err) => {
					console.log("Attribute 'selectedHotel' set with content of '"+hotelName+"'");
				});
			})						
		});
	}		
}

module.exports = HotelSelectionHandler;
