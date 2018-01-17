const StringConstants = require("./../../config/Constants");


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
						app
							.followUpState("ThingKnownState")
							.ask("Alright here comes the description: "+descriptionText, StringConstants.INFO_NOT_UNDERSTAND);
					}else{
						app
                            .followUpState("ThingKnownState")
							.ask("I'm sorry, but the description property is not available.", StringConstants.INFO_NOT_UNDERSTAND)
					}
				}
				else{
					app
                        .followUpState("ThingKnownState")
						.ask("Alright here comes the description: "+descriptionArr, StringConstants.INFO_NOT_UNDERSTAND)
				}
			}else{
				app
                    .followUpState("ThingKnownState")
					.ask("I'm sorry, I couldn't find any description.",StringConstants.INFO_NOT_UNDERSTAND);
			}
    	});
		
	}		
}

module.exports = HotelDescriptionHandler;
