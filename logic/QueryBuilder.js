const Constants = require("./../config/Constants");

class QueryBuilder{
	
	Constructor(){
		
	}
	
		
	buildPriceFilter(thingType, city, numVal){
		return {
            type: new RegExp(thingType, "i"), website: new RegExp(city, "i"), "annotation.makesOffer": {
                "$elemMatch": {
                    $and: [{
                        "priceSpecification.minPrice": {$lte: numVal}
                    }, {
                        "priceSpecification.minPrice": {$ne: 0.00}
                    }
                    ]
                }
            }
        };
	}
		
	buildRatingFilter(thingType, city, numVal){
		return {
            type: new RegExp(thingType, "i"),
            website: new RegExp(city, "i"),
            "annotation.aggregateRating.ratingValue": {$gte: numVal}
        };
	}
	
	
	buildGeneralFilter(thingType, city){
		return {
            type: new RegExp(thingType, "i"),
            website: new RegExp(city, "i")
		};
	}
	
	
	buildGeospatialFilter(longitude, latitude){
		return {
			"geoInfo": { 
				$near : {
					      $geometry: { type: "Point",  coordinates: [ longitude, latitude ] },
					      $minDistance: 0,
					      $maxDistance: Constants.NEAR
				         }
				      }
				   };
	}
	
}


module.exports = QueryBuilder;