var mongoose = require('mongoose');
mongoose.Promise = Promise;

var schema = mongoose.Schema({
    company_id : {type : String, require :true},
    company_name : {type :String, require : true},

});

module.exports = mongoose.model('company',schema);