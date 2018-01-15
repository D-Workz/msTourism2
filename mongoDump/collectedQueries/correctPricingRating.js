db.getCollection('annotations').find({type:/Hotel/i}).forEach(function(obj){
   if(obj.annotation.makesOffer || (obj.annotation.aggregateRating && (obj.annotation.aggregateRating.ratingVal || obj.annotation.aggregateRating.reviewCount))){
       if(obj.annotation.makesOffer){
          obj.annotation.makesOffer.forEach(function(makesOfferEntry){
             if(makesOfferEntry.priceSpecification){
                    makesOfferEntry.priceSpecification.forEach(function(priceEntry){
                        if(priceEntry.minPrice || priceEntry.maxPrice){
                            if(priceEntry.minPrice){
                                priceEntry.minPrice = parseFloat(priceEntry.minPrice);
                            }
                            if(priceEntry.maxPrice){
                                priceEntry.maxPrice = parseFloat(priceEntry.maxPrice);
                            }                     
                        }
                    })
             }
          })                                       
       }
       if(obj.annotation.aggregateRating){
           if(obj.annotation.aggregateRating.ratingValue){
                obj.annotation.aggregateRating.ratingValue = parseFloat(obj.annotation.aggregateRating.ratingValue);
           }
           if(obj.annotation.aggregateRating.reviewCount){
                obj.annotation.aggregateRating.reviewCount = new NumberInt(obj.annotation.aggregateRating.reviewCount);
           }    
       }
    db.getCollection('annotations').save(obj);        
   }
})    