

class HotelSelectionHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
		var hotelName = app.inputs.selectedHotelName;
		
		db.mfindOne({type:/Hotel/, "annotation.name": new RegExp(hotelName,"i")}).then((data) =>{
			data.forEach((entry) => {
				app.db().save("selectedHotel", entry, (err) => {
					console.log("Attribute 'selectedHotel' set with content of '"+entry.annotation.name+"'");
				});
			})						
		});
	}		
}

module.exports = HotelSelectionHandler;
