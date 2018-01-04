

class HotelAddressHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			let address = data.annotation.address;
			let addressString = address.streetAddress+", "+address.postalCode+" "+address.addressLocality+" ("+address.addressCountry+")";
    	    app.tell("'"+data.annotation.name+"' is located in "+addressString);
    	});
		
	}		
}

module.exports = HotelAddressHandler;
