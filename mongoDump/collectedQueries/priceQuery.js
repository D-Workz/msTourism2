db.getCollection('annotations').find({"annotation.makesOffer":{"$elemMatch":{"priceSpecification.maxPrice":{$gt:"4000.00"}}}})

