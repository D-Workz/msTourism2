const StringConstants = require("./../../config/Constants");


class HelperHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.db().load("selectedHotel", (err, selectedHotel) => {
			app.db().load("city", (err, city) => {
				let retString = "";
				if(city && selectedHotel){
					retString = "Actually we are talking about "+selectedHotel.annotation.name+" ("+selectedHotel.annotation["@type"]+") in "+city+
						". But";
				}
				app.ask(retString + (retString === "" ? "Y" : " y")+"ou can "+StringConstants.AVAILABLE_CHANGER+". Available things are "+
						StringConstants.AVAILABLE_TYPE+". You can "+StringConstants.AVAILABLE_PROPERTIES+". It is also possible to "+
						StringConstants.AVAILABLE_FILTER);
			});
    	});		
	}		
}

module.exports = HelperHandler;
