
const Constants = require("./../../config/Constants");

class FunCreditHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.ask(Constants.CREDIT_INFO);
		
	}		
}

module.exports = FunCreditHandler;
