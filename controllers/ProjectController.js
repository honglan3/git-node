var express = require('express');
var router = express.Router();
var Project = require("../models/Project");
var File = require("../models/File");
var Commit = require("../models/Commit");

module.exports = {
    
    "addProject" : (project,callback) => {
        var project = new Project(project);
        project.save((err) => {
            if(err)
                return callback(null,err);
            var file = new File({
                "name" : project.name,
                "type" : 'FOLDER',
                "master_user" : project["master_user"],
                "parent" : null,
                "project" : project['_id'],
                "project_entry_point" : true
            });
            file.save((err) => {
                if(err)
                    return callback(null,err);
                var commit = new Commit({
                    "message" : "Initial Commit",
                    "file" : file['_id'],
                    "parent_commit" : null,
                    "user" : project["master_user"],
                    "content" : null
                });
                commit.save((err) => {
                    if(err)
                        return callback(null,err);
                    return callback(project,null);
                });
            });
        });
    },

    "deleteProject" : (projectId,callback) => {
        Project.findByIdAndRemove(projectId,(err,project) => {
            if(err)
                return callback(null,err);
            return callback(project,null);
        });
    },

    "getProjectStart" : (projectId,callback) => {
        File.findOne({'project' : projectId,'project_entry_point' : true},(err,file) => {
            if(err)
                return callback(null,err);
            return callback(file,null);
        });
    }

};
