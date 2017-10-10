var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    "email" : {
        type : String,
        required: true,
        unique : true
    },
    "account_type" : {
        type : String,
        enum : ['google','facebook','linkedin'],
        required : true
    },
    "account_id" : {
        type : String,
        required : true
    },
    "pic_url" : {
        type : String,
        required : false
    },
    "created_date" : {
        type : Date,
        required : false
    },
    "modified_date" : {
        type : Date,
        required : false
    }
});

UserSchema.pre('save',function(next){
    var date = new Date();
    this["created_date"] = date;
    this["modified_date"] = date;
    next();
});

UserSchema.pre('update',function(next){
    var date = new Date();
    this["modified_date"] = date;
    next();
})

var User = mongoose.model("User",UserSchema);

module.exports = User;