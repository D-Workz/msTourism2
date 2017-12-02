

class HotelPriceHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var hotelName = app.inputs.selectedHotelName;
			var rooms = data.annotation.makesOffer;
			var roomDistribution = {}
			rooms.forEach((roomEntry) => {
				if(!roomDistribution[roomEntry.itemOffered.name]){
					roomDistribution[roomEntry.itemOffered.name]="";
				}
				var minPrice = 100000000;
				var maxPrice = -1000000;
				roomEntry.priceSpecification.forEach((priceEntry) => {
					if(priceEntry.minPrice<minPrice){
						minPrice = priceEntry.minPrice;
					}
					if(priceEntry.maxPrice>maxPrice){
						maxPrice = priceEntry.maxPrice;
					}
				})
				roomDistribution[roomEntry.itemOffered.name]="between "+minPrice+" EUR and "+maxPrice+" EUR";
			})
			
			var roomDistributionText = "";
			
			for(var propertyName in roomDistribution){
				roomDistributionText += propertyName + " costs "+roomDistribution[propertyName]+", ";
			}
			
    	    app.tell("Ok, there are the prices of "+hotelName + ": "+roomDistributionText.substring(0,roomDistributionText.length-2)); 	        	        	    
    	});
		
	}		
}

module.exports = HotelPriceHandler;
