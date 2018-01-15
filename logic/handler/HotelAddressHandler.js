

class HotelAddressHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			let address = data.annotation.address;
			if(address){
				let addressString = address.streetAddress+", "+address.postalCode+" "+address.addressLocality+" ("+address.addressCountry+")";
	    	    app.ask("'"+data.annotation.name+"' is located in "+addressString);
			}else{
				app.ask("I'm sorry, I couldn't find any information about that.");
			}
    	});
		
	}		
}

module.exports = HotelAddressHandler;
