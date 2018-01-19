
const StringConstants = require("./../../config/Constants");

class HotelContactHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			let contactInfo = data.annotation.address;
			let contactString = "";
			
			if(contactInfo.telephone){
				contactString+="Telephone: "+contactInfo.telephone;
			}
			if(contactInfo.faxNumber){
				contactString+=", Fax: "+contactInfo.faxNumber;
			}
			if(contactInfo.email){
				contactString+=", E-Mail: "+contactInfo.email;
			}
			
			let answer = "";
			if(contactString===""){
				answer="I'm sorry, but there isn't any contact-information available";
			}else{
				answer="'"+data.annotation.name+"' can be contacted by "+contactString;
			}
			
    	    app.followUpState("ThingKnownState").ask(answer, StringConstants.INFO_NOT_UNDERSTAND);
    	});
		
	}		
}

module.exports = HotelContactHandler;
