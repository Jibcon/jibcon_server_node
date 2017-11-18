var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var weatherSchema = new Schema({
    city : {type:String, required : true},
    sky : {type:String},
    temperature : {type:String},
});

module.exports = mongoose.model('weatherDB', weatherSchema);


