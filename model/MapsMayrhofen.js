const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("DBUrl"), {useMongoClient: true});
mongoose.Promise = require('bluebird');


let mapsMayrhofenSchema = new mongoose.Schema({
    type:{type: String, unique: true},
    annotations:[],
    count:Number
});

// {"name":"Fischerrun","id":"59b6a76f9b0def28bae6dfc3","UID":"rJ-DOvXE9-","CID":"GS-1001510-de","type":["SportsActivityLocation"],"enc_url":"https%3A%2F%2Fmaps.seefeld.com%2Fde%23resourceDetail%2C1001510"},

mapsMayrhofenSchema.statics.updateAnnotationCollection = function (annotation, type, website) {
    const Annotations = mongoose.model(website);
        let concatType = "";
        for(let k=0;k<type.length;k++) {
            concatType += type[k] + ", "
        }
        concatType = concatType.slice(0,-2);
            Annotations
                .findOne({type:concatType})
                .then(function (annotationType) {
                    if(!annotationType){
                        let newAnnotationsType = new Annotations();
                        newAnnotationsType.type = concatType;
                        newAnnotationsType.count = 1;
                        newAnnotationsType.annotations.push(annotation);
                        newAnnotationsType.save(function (err) {
                            if (err) {
                                return next(err);
                            } else {
                                console.log("successfully created new annotation of type: " + concatType);
                            }
                        });
                    }else{
                        annotationType.count++;
                        annotationType.annotations.push(annotation);
                        annotationType.save(function (err) {
                            if (err) {
                                return next(err);
                            } else {
                                console.log("successfully updated annotation of type: " + concatType);
                            }
                        });
                    }
                })


};



mongoose.model('MapsMayrhofen', mapsMayrhofenSchema);