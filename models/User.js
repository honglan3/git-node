var mongoose = require('mongoose');
var Schema = mongooose.Schema;

var UserSchema = new Schema({
    "email" : {
        type : String,
        required: true,
        unique : true
    },
    "account_type" : {
        type : String,
        enum : ['GOOGLE','FACEBOOK','LINKEDIN'],
        required : true
    },
    "account_id" : {
        type : String,
        required : true
    },
    "pic_url" : {
        type : String,
        required : false
    }
});

var User = mongoose.model("User",UserSchema);

module.exports = User;