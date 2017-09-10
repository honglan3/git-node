var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommitSchema = new Schema({
    "message" : {
        type : String,
        required : false
    },
    "file" : {
        type : Schema.Types.ObjectId,
        ref : 'File',
        required : true
    },
    "parent_commit" : {
        type : Schema.Types.ObjectId,
        ref : 'Commit',
        required : false
    },
    "user" : {
        type: Schema.Types.ObjectId, 
        ref : 'User',
        required : true
    },
    "content" : {
        type : String,
        required :  false
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

CommitSchema.pre('save',function(next){
    var date = new Date();
    this["created_date"] = date;
    this["modified_date"] = date;
    next();
});

CommitSchema.pre('update',function(next){
    var date = new Date();
    this["modified_date"] = date;
    next();
})

var File = mongoose.model("Commit",CommitSchema);

module.exports = File;