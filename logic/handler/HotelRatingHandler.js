

class HotelRatingHandler{
	
	constructor(){

	}
	
	doFulfill(app,db){		
		app.db().load("selectedHotel", (err, data) => {
			var rating = data.annotation.aggregateRating;
			if(rating){
    	    app.ask(data.annotation.name+" has a rating of "+rating.ratingValue + " among "+rating.reviewCount + " ratings.");
            }else{
                app.ask(data.annotation.name+" has no rating information");
			}
    	});
		
	}		
}

module.exports = HotelRatingHandler;
