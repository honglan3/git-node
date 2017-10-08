var File = require("../models/File");
var Commit = require("../models/Commit");
var Project = require("../models/Project");
var EasyZip = require('easy-zip').EasyZip;

module.exports = {

    "createFolder" : (projectId,callback) => {
        var files = null,commits = null,project = null;
        var zip = new EasyZip();
        File.find({'project' : projectId}).populate('master_user').then((filesSet) => {
            files = filesSet;
            var fileIds = files.map((item) => {
                return item['_id'];
            });
            return Commit.find({ 'file' : { '$in' : fileIds}}).populate('file').populate('user');
        })
        .then((commitsSet) => {
            commits = commitsSet;
            return Project.findById(projectId);
        })
        .then((projectItem) => {
            project = projectItem;
        })
        .then(() => {
            zip.zipFolder('./client',function(){
                var object = {
                    "project" : project,
                    "files" : files,
                    "commits" : commits
                };
                zip.file('client/js/DB.json',JSON.stringify(object));
                callback(zip,null);
            })
        })
        .catch((err) => {
            callback(null,err);
        })
    },

    "fetchFromServer" : function(projectId,callback){
        var files = null,commits = null,project = null;
        File.find({'project' : projectId}).populate('master_user').then((filesSet) => {
            files = filesSet;
            var fileIds = files.map((item) => {
                return item['_id'];
            });
            return Commit.find({ 'file' : { '$in' : fileIds}}).populate('file').populate('user');
        })
        .then((commitsSet) => {
            commits = commitsSet;
            return Project.findById(projectId);
        })
        .then((projectItem) => {
            project = projectItem;
        })
        .then(() => {
            var object = {
                "project" : project,
                "files" : files,
                "commits" : commits
            };
            callback(object,null);  
        })
        .catch((err) => {
            callback(null,err);
        })
    },

    "pushToDB" : function(DB,callback){
        Project.findOneAndUpdate({'_id' : DB.project['_id']}, DB.project, {upsert:true})
        .then((data) => {
            var commits = DB.commits;
            var promises = [];
            for(var i = 0 ; i < commits.length ; i++){
                promises.push(Commit.findOneAndUpdate({'_id' : DB.commits[i]['_id']}, DB.commits[i], {upsert:true}));
            }
            return Promise.all(promises);
        })
        .then((data) => {
            callback(data,null);
        })
        .catch((error) => {
            callback(null,error);
        })
    }
}