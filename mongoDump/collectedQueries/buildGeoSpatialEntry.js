db.getCollection('annotationsGeospatialTest').find().forEach(function(e){            
            if(e.annotation.geo){
                var helper = e.annotation.geo;
		var longitudeToSet = 0;
		var latitudeToSet = 0;
		if(helper.longitude && helper.latitude && helper.longitude<=180 && helper.latitude<=90){
		  longitudeToSet=helper.longitude;
		  latitudeToSet=helper.latitude;
		}                
                db.getCollection('annotationsGeospatialTest').update({_id:e._id},{$set:{geoInfo:{type:"Point", coordinates : [Number(longitudeToSet),Number(latitudeToSet)]}}})                
            }
})
