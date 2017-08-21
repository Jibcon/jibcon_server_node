var mongoose = require('mongoose');
mongoose.Promise = Promise;

var schema = mongoose.Schema({
    // id : {type : String, required : true},
    deviceCom : {type : String, requied : true},
    deviceName : {type : String, requied : true},
    deviceType : {type : String, requied : true},
    deviceOnOffState : {type : Boolean, required : true},
    subscribeOnOffState : {type : Boolean, required : true},
    roomName : {type : String},
    aeName : {type : String},
    cntName : {type : String},
    content : {type : String},


});


module.exports = mongoose.model('device',schema);