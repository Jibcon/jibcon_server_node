var mongoose = require('mongoose');
let User = require('./user');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var weatherSchema = new Schema({
    time :{type:String},
    lat: {type : String, required : true},
    lon: {type : String, required : true},
    writer: {type: Schema.Types.ObjectId, ref: 'user'},
    userId : {type:String, required:true}
});

module.exports = mongoose.model('weather', weatherSchema);

