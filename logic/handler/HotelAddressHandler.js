
const StringConstants = require("./../../config/Constants");

class HotelAddressHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			let address = data.annotation.address;
			if(address){
				let addressString = address.streetAddress+", "+address.postalCode+" "+address.addressLocality+" ("+address.addressCountry+")";
	    	    app
                    .followUpState("ThingKnownState")
					.ask("'"+data.annotation.name+"' is located in "+addressString, StringConstants.INFO_NOT_UNDERSTAND);
			}else{
				app
                    .followUpState("ThingKnownState")
					.ask("I'm sorry, I couldn't find any information about that.", StringConstants.INFO_NOT_UNDERSTAND);
			}
    	});
		
	}		
}

module.exports = HotelAddressHandler;
