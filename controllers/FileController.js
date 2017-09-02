var express = require('express');
var router = express.Router();
var File = require("../models/File");
var saveFile = require("../utils/saveFile");

module.exports = {
    
    "addFile" : (file,commitMessage,content,callback) => {
        var file = new File(file);
        file.save((err) => {
            if(err)
                return callback(null,err);
            var commit = new Commit({
                "message" : commitMessage,
                "file" : file['_id'],
                "user" : file['master_user'],
                "parent_commit" : null,
                "location" : saveFile(content,file['name'])
            });
            commit.save((err) => {
                if(err)
                    return callback(null,err);
                return callback(commit,null);
            });
            return callback(file,err);
        })
    },

    "deleteFile" : (fileId,callback) => {
        File.findByIdAndRemove(fileId,(err,file) => {
            if(err)
                return callback(null,err);
            return callback(file,null);
        });
    },

    "updateFile" : (file,callback) => {
        File.findOneAndUpdate({ '_id' : file['_id']},file,(err,updatedFile) => {
            if(err)
                return callback(null,err);
            return callback(updatedFile,null);
        });
    }

};
