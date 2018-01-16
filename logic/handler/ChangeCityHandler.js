

class ChangeCityHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.ask("Say 'first' for 'Seefeld' or 'second' for 'Mayrhofen'");		
	}		
}

module.exports = ChangeCityHandler;
