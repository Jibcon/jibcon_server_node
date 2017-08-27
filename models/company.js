var mongoose = require('mongoose');
mongoose.Promise = Promise;

var schema = mongoose.Schema({
    name : {type :String, required: true},
    createdAt : {type :Date, default: Date.now},
    updatedAt : {type :Date, default: Date.now},
});

module.exports = mongoose.model('company',schema);