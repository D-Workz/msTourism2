const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
mongoose.Promise = require('bluebird');


let mapsSeefeldSchema = new mongoose.Schema({
    type:{type: String, unique: true},
    annotations:[],
    count:Number
});

mongoose.model('MapsSeefeld', mapsSeefeldSchema);