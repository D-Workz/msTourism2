class HotelSelectionHandler {

    constructor() {

    }

    doFulfill(app, db) {

        let hotelName = app.inputs.selectedHotelName;
        if(!hotelName){
            hotelName = app.inputs.hotelName;
        }

        db.mfindOne({type: /Hotel/, "annotation.name": new RegExp(hotelName, "i")}).then((data) => {
        	if(data.length>0){
	            if (Array.isArray(data)) {
	                data.forEach((entry) => {
	                    app.db().save("selectedHotel", data, (err) => {
	                        console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
	                        app.ask("What do you want to know? I can give you a description, information about rooms and prices, the location, contact infos and the average rating.");
	                    });
	                });
	            } else {
	                app.db().save("selectedHotel", data, (err) => {
	                    console.log("Attribute 'selectedHotel' set with content of '" + data.annotation.name + "'");
	                    app.ask("What do you want to know? I can give you a description, information about rooms and prices, the location, contact infos and the average rating.");
	                });
	            }
        	}else{
        		app.ask("I'm sorry. I couldn't find any Hotel with name '"+hotelName+"'")
        	}            
        });


    }
}

module.exports = HotelSelectionHandler;
