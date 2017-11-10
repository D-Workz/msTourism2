const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
mongoose.Promise = require('bluebird');

require('./Seefeld');


let MayrhofenSchema = new mongoose.Schema({
    type: {type: String},
    name: {type: String},
    annotation: {type: Object},
    annotationId: {type: String,  unique: true}
});

// {"name":"Fischerrun","id":"59b6a76f9b0def28bae6dfc3","UID":"rJ-DOvXE9-","CID":"GS-1001510-de","type":["SportsActivityLocation"],"enc_url":"https%3A%2F%2Fmaps.seefeld.com%2Fde%23resourceDetail%2C1001510"},


mongoose.model('Mayrhofen', MayrhofenSchema);