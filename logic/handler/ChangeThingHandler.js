const StringConstants = require("./../../config/Constants");

class ChangeThingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.ask("About which thing do you want to talk? Available are "+StringConstants.AVAILABLE_THINGS);
	}		
}

module.exports = ChangeThingHandler;
