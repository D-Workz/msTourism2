db.getCollection('annotationsGeospatialTest').find(
   {
     "geoInfo":
       { $near :
          {
            $geometry: { type: "Point",  coordinates: [ 11.1445645809511, 47.368966301811 ] },
            $minDistance: 100,
            $maxDistance: 100
          }
       }
   }
)
