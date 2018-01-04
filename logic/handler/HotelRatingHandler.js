

class HotelRatingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){		
		app.db().load("selectedHotel", (err, data) => {
			if(data.annotation.aggregateRating){
				var rating = data.annotation.aggregateRating;
	    	    app.tell(data.annotation.name+" has a rating of "+rating.ratingValue + " among "+rating.reviewCount + " ratings.");
			}else{
				app.tell("Sorry, I couldn't find any rating for '"+data.annotation.name+"'")
			}
    	});
		
	}		
}

module.exports = HotelRatingHandler;
