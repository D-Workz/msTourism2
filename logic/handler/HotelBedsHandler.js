

class HotelBedsHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var hotelName = app.inputs.selectedHotelName;
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
					app.tell("Alright. There are "+nrOfBeds+" beds in total in "+hotelName +": "+roomDistributionText.substring(0,roomDistributionText.length-2)); 	    
			}else{
				app.tell("I'm terrible sorry, but I could not find the desired information");
			}			
    	});
		
	}		
}

module.exports = HotelBedsHandler;
