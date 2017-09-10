var express = require('express');
var router = express.Router();
var Commit = require("../models/Commit");
var File = require("../models/File");

module.exports = {
    
    "getCommit" : (commitId,callback) => {
        Commit.findById(commitId,(err,commit) => {
            if(err)
                return callback(null,err);
            return callback(commit,err);
        });
    },

    "addCommit" : (commit,callback) => {
        var commit = new Commit(commit);
        commit.save((err) => {
            if(err)
                return callback(null,err);
            return callback(commit,null);
        });
    },

    "deleteCommit" : (commitId,callback) => {
        Commit.findOneAndRemove({'_id' : commitId},(err,commit) => {
            if(err)
                return callback(null,err);
            return callback(commit,null);
        })
    },

    "updateCommit" : (commitId,commit,callback) => {
        Commit.findOneAndUpdate({ '_id' : commitId},commit,(err,commit) => {
            if(err)
                return callback(null,err);
            return callback(commit,null);
        });
    },

    "getCommitsByProjectId" : (projectId,callback) => {
        File.find({'project' : projectId},(err,files) => {
            var fileIds = files.map((item) => {
                return item['_id'];
            });
            Commit.find({ "file" : { id: { $in : fileId } } },(err,commits) => {
                if(err)
                    return callback(null,err);
                return callback(commits,null);
            });
        });
    },

    "getCommitsByProjectIdAndUserId" : (projectId,userId,callback) => {
        File.find({'project' : projectId},(err,files) => {
            var fileIds = files.map((item) => {
                return item['_id'];
            });
            Commit.find({ "file" : { id: { $in : fileId } }, "user" : userId },(err,commits) => {
                if(err)
                    return callback(null,err);
                return callback(commits,null);
            });
        });
    },

    
    "getCommitsByFileId" : (fileId,callback) => {
        Commit.find({ "file" :  fileId },(err,commits) => {
            if(err)
                return callback(null,err);
            return callback(commits,null);
        });
    },

    "getCommitsByFileIdAndUserId" : (fileId,userId,callback) => {
        Commit.find({ "file" :  fileId , "user" : userId },(err,commits) => {
            if(err)
                return callback(null,err);
            return callback(commits,null);
        });
    }

};
