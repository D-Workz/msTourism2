

class HelperHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.db().load("selectedHotel", (err, selectedHotel) => {
			app.db().load("city", (err, city) => {
				app.ask("We are talking about "+selectedHotel.annotation.name+" ("+selectedHotel.annotation["@type"]+") in "+city);
			});
    	});		
	}		
}

module.exports = HelperHandler;
