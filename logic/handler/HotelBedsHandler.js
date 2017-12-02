

class HotelBedsHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var hotelName = app.inputs.selectedHotelName;
			var rooms = data.annotation.makesOffer;
			var roomDistribution = {}
			var nrOfBeds = 0;
			rooms.forEach((roomEntry) => {
				if(!roomDistribution[roomEntry.itemOffered.name]){
					roomDistribution[roomEntry.itemOffered.name]=0;
				}
				roomDistribution[roomEntry.itemOffered.name]+=Number(roomEntry.itemOffered.bed.numberOfBeds);
				nrOfBeds+=Number(roomEntry.itemOffered.bed.numberOfBeds);
			})
			
			var roomDistributionText = "";
			
			for(var propertyName in roomDistribution){
				roomDistributionText += roomDistribution[propertyName] + " bed"+(roomDistribution[propertyName] > 1 ? "s" : "")+" in "+propertyName+", ";
			}
			
    	    app.tell("Alright. There are "+nrOfBeds+" beds in total in "+hotelName +": "+roomDistributionText.substring(0,roomDistributionText.length-2)); 	    
    	        	    
    	});
		
	}		
}

module.exports = HotelBedsHandler;
