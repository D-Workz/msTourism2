db.getCollection('annotations').find({"annotation.makesOffer":{"$elemMatch":{"priceSpecification.maxPrice":{$gt:0.00}}}})

