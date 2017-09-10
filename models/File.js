var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
    "name" : {
        type : String,
        required : true
    },
    "type" : {
        type : String,
        enum : ['FILE','FOLDER']
    },
    "master_user" : {
        type: Schema.Types.ObjectId, 
        ref : 'User'
    },
    "parent" : {
        type : Schema.Types.ObjectId,
        ref : 'File'
    },
    "project" : {
        type : Schema.Types.ObjectId,
        ref : 'Project'
    },
    "project_entry_point" : {
        type : Boolean,
        required : true
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

FileSchema.pre('save',function(next){
    var date = new Date();
    this["created_date"] = date;
    this["modified_date"] = date;
    next();
});

FileSchema.pre('update',function(next){
    var date = new Date();
    this["modified_date"] = date;
    next();
})



var File = mongoose.model("File",FileSchema);

module.exports = File;