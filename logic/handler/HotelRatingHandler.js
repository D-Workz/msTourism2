const StringConstants = require("./../../config/Constants");


class HotelRatingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){		
		app.db().load("selectedHotel", (err, data) => {
			var rating = data.annotation.aggregateRating;
			if(rating){
    	    app
                .followUpState("ThingKnownState")
				.ask(data.annotation.name+" has a rating of "+rating.ratingValue + " among "+rating.reviewCount + " ratings.", StringConstants.INFO_NOT_UNDERSTAND);
            }else{
                app
                    .followUpState("ThingKnownState")
					.ask(data.annotation.name+" has no rating information", StringConstants.INFO_NOT_UNDERSTAND);
			}
    	});
		
	}		
}

module.exports = HotelRatingHandler;
