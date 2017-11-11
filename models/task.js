var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var taskSchema = new Schema({
    time_id : {type : String,required : true},
    userId : {type:String, required :true},
    task_type : {type:String},
    data : Object
});

module.exports = mongoose.model('task', taskSchema);

