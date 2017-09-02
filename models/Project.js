var mongoose = require('mongoose');
var Schema = mongooose.Schema;

var FileSchema = new Schema({
    "name" : {
        type : String,
        required : true
    },
    "master_user" : {
        type: Schema.Types.ObjectId, 
        ref : 'User'
    },
    "project_entry_point" : {
        type : Schema.Types.ObjectId,
        ref : 'File'
    },
    "collaborators" : [{ 
        type : Schema.Types.ObjectId,
        ref : 'User'
    }]
});


var File = mongoose.model("File",FileSchema);

module.exports = File;