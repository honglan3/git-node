var express = require('express');
var router = express.Router();
var Project = require("../models/Project");

module.exports = {
    
    "addProject" : (project,callback) => {
        var project = new Project(project);
        project.save(project,(err) => {
            if(err)
                return callback(null,err);
            return callback(project,null);
        });
    },

    "deleteProject" : (projectId,callback) => {
        Project.findByIdAndRemove(projectId,(err,project) => {
            if(err)
                return callback(null,err);
            return callback(project,null);
        });
    }

};
