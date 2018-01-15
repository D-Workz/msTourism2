

class HotelDescriptionHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var descriptionArr = data.annotation.description;
			if(descriptionArr){
				var descriptionText = "";
				if(Array.isArray(descriptionArr)){					
					descriptionArr.forEach((descEntry) => {
						descriptionText += descEntry+". ";
					})
					if(descriptionText!==""){
						app.ask("Alright here comes the description: "+descriptionText);
					}else{
						app.ask("I'm sorry, but the description property is not available.")
					}
				}
				else{
					app.ask("Alright here comes the description: "+descriptionArr)
				}
			}else{
				app.ask("I'm sorry, I couldn't find any description.");
			}
    	});
		
	}		
}

module.exports = HotelDescriptionHandler;
