const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
mongoose.Promise = require('bluebird');


let SeefeldSchema = new mongoose.Schema({
    type: {type: String},
    name: {type: String},
    annotation: {type: Object},
    annotationId: {type: String,  unique: true}
});

mongoose.model('Seefeld', SeefeldSchema);