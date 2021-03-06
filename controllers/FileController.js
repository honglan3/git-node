var express = require('express');
var router = express.Router();
var File = require("../models/File");
var Commit = require("../models/Commit");
var saveFile = require("../utils/saveFile");

module.exports = {
    
    "addFile" : (file,callback) => {
        var content = file['content'];
        delete file['content'];
        var file = new File(file);
        file.save((err) => {
            if(err)
                return callback(null,err);
            var commit = new Commit({
                "message" : "Initial Commit",
                "file" : file,
                "user" : file['master_user'],
                "parent_commit" : null,
                "content" : content
            });
            console.log(commit);
            commit.save((err) => {
                if(err)
                    return callback(null,err);
                return callback(commit,null);
            });
        })
    },

    "deleteFile" : (fileId,callback) => {
        File.findByIdAndRemove(fileId,(err,file) => {
            if(err)
                return callback(null,err);
            return callback(file,null);
        });
    },

    "updateFile" : (fileId,file,callback) => {
        File.findOneAndUpdate({ '_id' : fileId},file,(err,updatedFile) => {
            if(err)
                return callback(null,err);
            return callback(updatedFile,null);
        });
    },

    "getFolderContents" : (fileId,callback) => {
        File.find({ 'parent' : fileId}).populate('master_user').exec((err,files) => {
            if(err)
                return callback(null,err);
            return callback(files,null);
        });
    },

    "getStartingPoint" : (projectId,callback) => {
        File.findOne({ 'project' : projectId , 'project_entry_point' : true}).populate('master_user').exec((err,file) => {
            if(err)
                return callback(null,err);
            return callback(file,null);
        });
    },

    "getFileById" : (fileId,callback) => {
        File.findOne({ '_id' : fileId }).populate('master_user').exec((err,file) => {
            if(err)
                return callback(null,err);
            return callback(file,null);
        });
    }
};
