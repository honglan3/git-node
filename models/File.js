var mongoose = require('mongoose');
var Schema = mongooose.Schema;

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
    }
});


var File = mongoose.model("File",FileSchema);

module.exports = File;