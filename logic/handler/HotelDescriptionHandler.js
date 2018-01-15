

class HotelDescriptionHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var descriptionArr = data.annotation.description;
			if(descriptionArr && descriptionArr.lengt>0){
				var descriptionText = "";
				descriptionArr.forEach((descEntry) => {
					descriptionText += descEntry+". ";
				})
	    	    app.ask("Alright here comes the description: "+descriptionText);
			}else{
				app.ask("I'm sorry, I couldn't find any description.");
			}
    	});
		
	}		
}

module.exports = HotelDescriptionHandler;
