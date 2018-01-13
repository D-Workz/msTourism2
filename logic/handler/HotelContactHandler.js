

class HotelContactHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			let contactInfo = data.annotation.address;
			let contactString = "Telephone: "+contactInfo.telephone+", Fax: "+contactInfo.faxNumber+", E-Mail: "+contactInfo.email;
    	    app.ask("'"+data.annotation.name+"' can be contacted by "+contactString);
    	});
		
	}		
}

module.exports = HotelContactHandler;
