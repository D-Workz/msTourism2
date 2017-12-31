const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});

// const Annotations = mongoose.model('Annotation');
// require('./Annotation');


let AnnotationSchema = new mongoose.Schema({
    type: {type: String},
    name: {type: String},
    annotation: {type: Object},
    annotationId: {type: String,  unique: true},
    website:{type: String},
    language:{type: String}
});


AnnotationSchema.statics.mfind = function (query, result) {
    this
        .find(query)
        .then(function (results) {
            return result(results);
        })
};


mongoose.model('Annotation', AnnotationSchema);