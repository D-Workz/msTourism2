db.getCollection('seefeldatsGeoLocationTest').aggregate(
{
    $geoNear : {
        near : { type: "Point", coordinates: [ 11.1445645809511 , 47.368966301811 ] },
        spherical : true,
        distanceField: "dist.calculated",
        includeLocs: "dist.loc",
        maxDistance : 1000
}},
{$unwind : "$annotations"}).toArray()