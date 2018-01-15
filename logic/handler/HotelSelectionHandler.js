const INFO_POSSIBILITIES_STRING = "What do you want to know? I can give you a description, information about rooms and prices, the location, contact infos and the average rating.";

class HotelSelectionHandler {

    constructor() {

    }

    doFulfill(app, db) {

        let hotelName = app.inputs.selectedHotelName;
        if(!hotelName){
            hotelName = app.inputs.hotelName;
        }
        let that = this;

        if (hotelName && hotelName != '') {
	        db.mfindOne({type: /Hotel/, "annotation.name": new RegExp(hotelName, "i")}).then((data) => {
		            if (Array.isArray(data)) {
		            	if(data.length>0){
			                data.forEach((entry) => {
			                    app.db().save("selectedHotel", data, (err) => {
			                        console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
			                        app.ask(INFO_POSSIBILITIES_STRING);
			                    });
			                });
		            	}else{
		            		that.doInformAboutNoMatch(app, hotelName);
		            	}
		            } else {
		            	if(data){
			                app.db().save("selectedHotel", data, (err) => {
			                    console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
			                    app.ask(INFO_POSSIBILITIES_STRING);
			                });
		            	}
		            	else{
		            		that.doInformAboutNoMatch(app, hotelName);	            		
		            	}
		            }
	        });
	    }else{
	    	app.ask("I'm sorry. I couldn't understand the hotel name.");
	    }
    }    
        
    doInformAboutNoMatch(app, hotelName){
    	app.ask("I'm sorry. I couldn't find any Hotel with name '"+hotelName+"'");
    }
    
}

module.exports = HotelSelectionHandler;
