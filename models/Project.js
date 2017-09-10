var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    "name" : {
        type : String,
        required : true
    },
    "master_user" : {
        type: Schema.Types.ObjectId, 
        ref : 'User'
    },
    "collaborators" : [{ 
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    "created_date" : {
        type : Date,
        required : false
    },
    "modified_date" : {
        type : Date,
        required : false
    }
});

ProjectSchema.pre('save',function(next){
    var date = new Date();
    this["created_date"] = date;
    this["modified_date"] = date;
    next();
});

ProjectSchema.pre('update',function(next){
    var date = new Date();
    this["modified_date"] = date;
    next();
})

var Project = mongoose.model("Project",ProjectSchema);

module.exports = Project;