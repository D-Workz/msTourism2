const StringConstants = require("./../../config/Constants");


class ChangeCityHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){				
		app.followUpState("SelectCityState")
			.ask("For 'Seefeld' say 'one' or For 'Mayrhofen' say 'two'", StringConstants.INFO_NOT_UNDERSTAND + "For 'Seefeld' say 'one' or For 'Mayrhofen' say 'two'");
	}		
}

module.exports = ChangeCityHandler;
