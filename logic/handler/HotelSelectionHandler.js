

class HotelSelectionHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
		var hotelName = app.inputs.selectedHotelName;
		
		db.aggregate({$unwind:"$annotations"},{$match:{type:"Hotel", "annotations.annotation.name":hotelName}},{$limit: 1}).then((data) =>{
			data.forEach((entry) => {
				app.db().save("selectedHotel", entry, (err) => {
					console.log("Attribute 'selectedHotel' set with content of '"+hotelName+"'");
				});
			})						
		});
	}		
}

module.exports = HotelSelectionHandler;
