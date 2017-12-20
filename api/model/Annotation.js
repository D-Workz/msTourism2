const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});


let AnnotationSchema = new mongoose.Schema({
    type: {type: String},
    name: {type: String},
    annotation: {type: Object},
    annotationId: {type: String,  unique: true},
    website:{type: String},
    language:{type: String}
});

mongoose.model('Annotation', AnnotationSchema);