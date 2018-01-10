const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});

let GeospatialProjectionSchema = new mongoose.Schema({
	annotationID: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Annotation'
	},
	geoInfo : {
		type: {type: String}, 
		coordinates : [Number,Number]
	}
});

mongoose.model('GeospatialProjection', GeospatialProjectionSchema);