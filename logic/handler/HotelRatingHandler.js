

class HotelRatingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){		
		app.db().load("selectedHotel", (err, data) => {
			var rating = data.annotations.annotation.aggregateRating;
    	    app.tell(data.annotations.annotation.name+" has a rating of "+rating.ratingValue + " among "+rating.reviewCount + " ratings.");
    	});
		
	}		
}

module.exports = HotelRatingHandler;
