

class HotelDescriptionHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var descriptionArr = data.annotations.annotation.description;
			var descriptionText = "";
			descriptionArr.forEach((descEntry) => {
				descriptionText += descEntry+". ";
			})
    	    app.tell("Alright here comes the description: "+descriptionText);
    	});
		
	}		
}

module.exports = HotelDescriptionHandler;
