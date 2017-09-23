var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var userSchema = new Schema({
    //token이 유저의 PK값
    email: {type: String, requried: true},
    first_name: {type: String, requried: true},
    last_name: {type: String, required: true},
    token: {type: String, required: true},
    fcm_token : {type : String},
    userinfo: {
        pic_url: {type: String},
        type: {type: String},
        token: {type: String},
        full_name: {type: String}
    },
});

module.exports = mongoose.model('user', userSchema);