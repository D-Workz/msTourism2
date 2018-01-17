const StringConstants = require("./../../config/Constants");


class HotelBedsHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var hotelName = data.annotation.name;
			var rooms = data.annotation.makesOffer;
			var roomDistribution = {}
			var nrOfBeds = 0;
			if(rooms){
				rooms.forEach((roomEntry) => {
					if(!roomDistribution[roomEntry.itemOffered.name]){
						roomDistribution[roomEntry.itemOffered.name]=0;
					}
					var bedInfo = roomEntry.itemOffered.bed;
					if(bedInfo){
						roomDistribution[roomEntry.itemOffered.name]+=Number(bedInfo.numberOfBeds);
						nrOfBeds+=Number(bedInfo.numberOfBeds);
					}
				})
				
				var roomDistributionText = "";
				
				for(var propertyName in roomDistribution){
					roomDistributionText += roomDistribution[propertyName] + " bed"+(roomDistribution[propertyName] > 1 ? "s" : "")+" in "+propertyName+", ";
				}
				let bedVerb = "are";
				let bedString = "beds";

				if(nrOfBeds===1){
					bedVerb="is";
					bedString="bed";
				}
					app
                        .followUpState("ThingKnownState")
						.ask("Alright. There are "+nrOfBeds+" beds in total in "+hotelName , StringConstants.INFO_NOT_UNDERSTAND); //+": "+roomDistributionText.substring(0,roomDistributionText.length-2)
			}else{
				app
                    .followUpState("ThingKnownState")
					.ask("I'm terrible sorry, but I could not find the desired information", StringConstants.INFO_NOT_UNDERSTAND);
			}			
    	});
		
	}		
}

module.exports = HotelBedsHandler;
