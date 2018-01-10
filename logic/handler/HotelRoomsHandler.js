

class HotelRoomsHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var hotelName = app.inputs.selectedHotelName;
			var rooms = data.annotation.makesOffer;
			var roomDistribution = {}
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
			
    	    app.ask(hotelName + " has "+rooms.length+" room"+(rooms.length > 1 ? "s" : "") +" available: "+roomDistributionText.substring(0,roomDistributionText.length-2));
    	        	    
    	});
		
	}		
}

module.exports = HotelRoomsHandler;
