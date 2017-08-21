var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;
var userSchema = new Schema({

    email: {type: String, requried: true},
    pic_url: {type: String, required: true},
    first_name: {type: String, requried: true},
    last_name: {type: String, required: true},
    user_id: {type: String, required: true},
    token: {type: String, required: true},
    deviceItems: [{

        deviceCom: {type: String, requied: true},
        deviceName: {type: String, requied: true},
        deviceType: {type: String, requied: true},
        deviceOnOffState: {type: Boolean, required: true},
        subscribeOnOffState: {type: Boolean, required: true},
        roomName: {type: String},
        aeName: {type: String},
        cntName: {type: String},
        content: {type: String},
    }]

});

module.exports = mongoose.model('user', userSchema);