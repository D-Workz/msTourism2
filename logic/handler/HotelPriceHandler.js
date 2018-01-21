const StringConstants = require("./../../config/Constants");


class HotelPriceHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){
				
		app.db().load("selectedHotel", (err, data) => {
			var hotelName = data.annotation.name;
			var rooms = data.annotation.makesOffer;
			var roomDistribution = {};
			let totalMinPrice = 10000000;
			let totalMaxPrice = 0;

			if(rooms){
				rooms.forEach((roomEntry) => {
					if(roomEntry.priceSpecification){
						if(!roomDistribution[roomEntry.itemOffered.name]){
							roomDistribution[roomEntry.itemOffered.name]="";
						}
						var minPrice = 100000000;
						var maxPrice = -1000000;

						//if price-property exists
						roomEntry.priceSpecification.forEach((priceEntry) => {
							if(priceEntry.minPrice<minPrice){
								minPrice = priceEntry.minPrice;
								totalMinPrice = priceEntry.minPrice;
							}
							if(priceEntry.maxPrice>maxPrice){
								maxPrice = priceEntry.maxPrice;
								totalMaxPrice = priceEntry.maxPrice
							}
						})
						roomDistribution[roomEntry.itemOffered.name]="between "+minPrice+" EUR and "+maxPrice+" EUR";
					}
				})

				var roomDistributionText = "";

				for(var propertyName in roomDistribution){
					roomDistributionText += propertyName + " costs "+roomDistribution[propertyName]+", ";
				}

                app
                    .followUpState("ThingKnownState")
					.ask("Rooms in the "+hotelName +" range between "+totalMinPrice + " and " +totalMaxPrice + " EUR.", StringConstants.INFO_NOT_UNDERSTAND);
                //+ ": "+roomDistributionText.substring(0,roomDistributionText.length-2)

                // let responseString = "";
                // if(roomDistributionText===""){
					// responseString="Sorry, I couldn't find any price specification for '"+data.annotation.name+"'."
                // }else{
					// responseString="Ok, there are the prices of "+data.annotation.name + ": "+roomDistributionText.substring(0,roomDistributionText.length-2);
                // }
	    	    // app.ask(responseString);
			}else{
				app
                    .followUpState("ThingKnownState")
					.ask("I'm sorry, I couldn't find any information about the desired property.", StringConstants.INFO_NOT_UNDERSTAND);
			}
    	});
		
	}		
}

module.exports = HotelPriceHandler;
