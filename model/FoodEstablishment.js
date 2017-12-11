const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("url_mongoDB"), {useMongoClient: true});
mongoose.Promise = require('bluebird');

let FoodEstablishmentSchema = new mongoose.Schema({
    name:{type: String},
    language:{type: String},
    CID:{type: String, unique: true},
    sdoAnnotation:{},
    sdoTypes:[],
    rating:Number
});

mongoose.model('FoodEstablishment', FoodEstablishmentSchema);