var express = require('express');
var router = express.Router();
var controller = require("../controllers/UserController");

router.get('/:emailId',function(req,res,next){
  controller.getUser(req.params.emailId,(user,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(user);
  });
});

router.get('/userId/:userId',function(req,res,next){
  controller.getUserByUserId(req.params.userId,(user,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(user);
  });
});

router.post('/',function(req,res,next){
  controller.addUser(req.body,(user,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(user);
  });
});

router.get('/:userId/projects',function(req,res,next){
  controller.getProjects(req.params.userId,(projects,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(projects);
  });
});

router.put('/addToProject/:projectId/:userId',function(req,res,next){
  controller.addUserToProject(req.params.projectId,req.params.userId,(project,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(project);
  });
});

module.exports = router;
