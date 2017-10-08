var fs = require("fs");
var uuid = require("uuid/v4");
var diff3 = require("node-diff3");
var util = require("util");
var Commit = require("../models/Commit");

module.exports = {
    
    "mergeFiles" : (commitId1,commitId2,userId,callback) => {
        var commit1 = null,commit2 = null;
        Commit.findById(commitId1).then((commit) => {
            commit1 = commit;
            return Commit.findById(commitId2);
        })
        .then((commit) => {
            commit2 = commit;
            if(commit2['content'].length > commit1['content'].length){
                content1 = commit2['content'];
                content2 = commit1['content'];
            }
            else{
                content2 = commit2['content'];
                content1 = commit1['content'];
            }
            var mergeFile = diff3.diff.merge(content2.split(" "),content2.split(" "),content1.split(" "));
            console.log(util.inspect(mergeFile, false, null))
            console.log("mergeFile = ",mergeFile.result.join(" "));
            var newCommit = new Commit({
                "message" : "Merged commit - "+uuid().toString(),
                "file" : commit['file'],
                "parent_commit" : null,
                "user" : userId,
                "content" : mergeFile.result.join(" ")
            });
            return newCommit.save();
        })
        .then((data) => {
            return callback(data,null);
        })
        .catch((err) => {
            console.log(err);
            return callback(null,err.toString());
        })
    }

};