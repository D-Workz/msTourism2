

class HotelDescriptionHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var descriptionArr = data.annotation.description;
			var descriptionText = "";
			descriptionArr.forEach((descEntry) => {
				descriptionText += descEntry+". ";
			})
    	    app.ask("Alright here comes the description: "+descriptionText);
    	});
		
	}		
}

module.exports = HotelDescriptionHandler;
