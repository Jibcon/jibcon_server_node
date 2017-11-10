var mongoose = require('mongoose');
var User = require('./user');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var timerSchema = new Schema({
    time : {type:String, required : true},
    users : [{type: Schema.Types.ObjectId, ref : 'user'}],
    
});

module.exports = mongoose.model('timer', timerSchema);

