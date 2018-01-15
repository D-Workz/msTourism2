

class HotelPriceHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			let hotelName = app.inputs.selectedHotelName;
			let rooms = data.annotation.makesOffer;
			let roomDistribution = {}
			rooms.forEach((roomEntry) => {
				if(roomEntry.priceSpecification){
					if(!roomDistribution[roomEntry.itemOffered.name]){
						roomDistribution[roomEntry.itemOffered.name]="";
					}
					let minPrice = 100000000;
					let maxPrice = -1000000;

					//if price-property exists
					roomEntry.priceSpecification.forEach((priceEntry) => {
						if(priceEntry.minPrice<minPrice){
							minPrice = priceEntry.minPrice;
						}
						if(priceEntry.maxPrice>maxPrice){
							maxPrice = priceEntry.maxPrice;
						}
					})
					roomDistribution[roomEntry.itemOffered.name]="between "+minPrice+" EUR and "+maxPrice+" EUR";
				}
			})
			
			let roomDistributionText = "";
			
			for(let propertyName in roomDistribution){
				roomDistributionText += propertyName + " costs "+roomDistribution[propertyName]+", ";
			}
			
    	    app.ask("Ok, there are the prices of "+hotelName + ": "+roomDistributionText.substring(0,roomDistributionText.length-2));
			let responseString = "";
			if(roomDistributionText===""){
				responseString="Sorry, I couldn't find any price specification for '"+data.annotation.name+"'."
			}else{
				responseString="Ok, there are the prices of "+data.annotation.name + ": "+roomDistributionText.substring(0,roomDistributionText.length-2);
			}
    	    app.ask(responseString);
    	});
		
	}		
}

module.exports = HotelPriceHandler;
