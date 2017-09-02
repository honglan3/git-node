var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Project = require("../models/Project");
var Commit = require('../models/Commit');

module.exports = {
    
    "addUser" : (user,callback) => {
        var User = new User(user);
        user.save((err) => {
            if(err)
               return callback(null,err);
            return callback(user,null); 
        });
    },

    "getProjects" : (userId,callback) => {
        Project.find({ "master_user" : userId },(err,projects) => {
            if(err)
                return callback(null,err);
            return callback(projects,null);
        })
    },

    "getCommits" : (userId,projectId,callback) => {
       // Commit.find({})
    },

    "getUser" : (emailId,callback) => {
        User.findOne({ "email" : emailId },(err,user) => {
            if(err)
                return callback(null,err);
            return callback(user,null);
        });
    },

    "addUserToProjects" : (projectId,userId) => {
        Project.update({ "_id" : projectId }, { $push: { "collaborators" : userId } },(err,project) => {
            if(err,project)
                return callback(null,err);
            return callback(project,null);
        });
    }
};
