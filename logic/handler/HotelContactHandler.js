
const StringConstants = require("./../../config/Constants");

class HotelContactHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			let contactInfo = data.annotation.address;
			let contactString = "Telephone: "+contactInfo.telephone+", Fax: "+contactInfo.faxNumber+", E-Mail: "+contactInfo.email;
    	    app
                .followUpState("ThingKnownState")
				.ask("'"+data.annotation.name+"' can be contacted by "+contactString, StringConstants.INFO_NOT_UNDERSTAND);
    	});
		
	}		
}

module.exports = HotelContactHandler;
