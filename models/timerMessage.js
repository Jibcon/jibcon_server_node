var mongoose = require('mongoose');
var User = require('./user');
let weather = require('./weatherMessage');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var timerMessageSchema = new Schema({
    time : {type:String, required : true},
    userId : {type: String, required:true},
    message : {type:String},
    timeJob : {type:String},
    writer: {type: Schema.Types.ObjectId, ref: 'user'}

});

module.exports = mongoose.model('timerMessage', timerMessageSchema);

