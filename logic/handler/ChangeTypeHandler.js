const StringConstants = require("./../../config/Constants");

class ChangeThingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.followUpState("SelectTypeState")
			.ask(StringConstants.INFO_TELL_YOU_ABOUT_CONTEXT + StringConstants.AVAILABLE_TYPE +" ", StringConstants.INFO_NOT_UNDERSTAND+ StringConstants.INFO_TELL_YOU_ABOUT_CONTEXT + StringConstants.AVAILABLE_TYPE +" ");
	}		
}

module.exports = ChangeThingHandler;
