

class ChangeCityHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.ask("For 'Seefeld' say 'one' or For 'Mayrhofen' say 'two'");
	}		
}

module.exports = ChangeCityHandler;
