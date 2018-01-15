const StringConstants = require("./../../config/Constants");

class ChangeThingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.ask("About which type of thing do you want to talk? Available are "+StringConstants.AVAILABLE_TYPE);
	}		
}

module.exports = ChangeThingHandler;
