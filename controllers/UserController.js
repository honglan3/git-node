var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Project = require("../models/Project");
var Commit = require('../models/Commit');
var File = require("../models/File");

module.exports = {
    
    "addUser" : (user,callback) => {
        var user = new User(user);
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
       File.find({ 'project' : projectId},(err,files) => {
           if(err)
                return callback(null,err);
           var fileIdList = files.map((item) => {
               return item['_id'];
           })
           Commit.find({ 'user' : userId , 'file' : { $in : fileIdList }},(err,commits) => {
                if(err)
                    return callback(null,err);
                return callback(commits,err);
           });
       });
    },

    "getUser" : (emailId,callback) => {
        User.findOne({ "email" : emailId },(err,user) => {
            if(err)
                return callback(null,err);
            return callback(user,null);
        });
    },

    "addUserToProject" : (projectId,userId,callback) => {
        console.log("project = ",projectId);
        console.log("user = ",userId);
        Project.update({ "_id" : projectId }, { $push: { "collaborators" : userId } },(err,project) => {
            if(err)
                return callback(null,err);
            return callback(project,null);
        });
    },

    "getUserByUserId" : (userId,callback) => {
        User.findOne({ "_id" : userId },(err,user) => {
            if(err)
                return callback(null,err);
            return callback(user,null);
        });
    }
};
