var mongoose = require('mongoose');
mongoose.Promise = Promise;

var schema = mongoose.Schema({
    type : {type : String, required : true},
    token : {type : String, require : true},
    pic_url : {type : String, required : true},
    full_name : {type : String, required : true}

});

module.exports = mongoose.model('userInfo',schema);