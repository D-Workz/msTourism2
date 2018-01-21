const StringConstants = require("./../../config/Constants");


class HotelRoomsHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var hotelName = data.annotation.name;
			var rooms = data.annotation.makesOffer;
			var roomDistribution = {}
			if(rooms){
				rooms.forEach((roomEntry) => {
					if(!roomDistribution[roomEntry.itemOffered.name]){
						roomDistribution[roomEntry.itemOffered.name]=0;
					}
					roomDistribution[roomEntry.itemOffered.name]+=1;
				})
				
				var roomDistributionText = "";
				
				for(var propertyName in roomDistribution){
					roomDistributionText += roomDistribution[propertyName] + " room"+(roomDistribution[propertyName] > 1 ? "s" : "")+" of type "+propertyName+", ";
				}				
	    	    app
                    .followUpState("ThingKnownState")
					.ask(hotelName + " has "+rooms.length+" room"+(rooms.length > 1 ? "s" : "") +" available", StringConstants.INFO_NOT_UNDERSTAND); 	   //: "+roomDistributionText.substring(0,roomDistributionText.length-2)
			}
			else{
				app
                    .followUpState("ThingKnownState")
					.ask(StringConstants.INFO_NOT_FOUND_CONTEXT + data.annotation.name, StringConstants.INFO_NOT_UNDERSTAND);
			}
    	});		
	}		
}

module.exports = HotelRoomsHandler;
