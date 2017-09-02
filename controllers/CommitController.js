var express = require('express');
var router = express.Router();
var Commit = require("../models/Commit");

module.exports = {
    
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
    }

};
