// Show me hotels in <location>
db.getCollection('seefeldats').aggregate(
    {$match: {type:'Hotel'}}, 
    {$unwind : "$annotations"},
    {$match : {"annotations.annotation.address.addressLocality":"Seefeld"}}
    ).toArray()




