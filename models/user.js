var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var userSchema = new Schema({

    email: {type: String, requried: true},
    first_name: {type: String, requried: true},
    last_name: {type: String, required: true},
    token: {type: String, required: true},
    user_id : {type : String},
    userinfo: {
        pic_url: {type: String},
        type: {type: String},
        token: {type: String},
        full_name: {type: String}
    },
});

module.exports = mongoose.model('user', userSchema);