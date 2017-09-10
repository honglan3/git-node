var express = require('express');
var router = express.Router();
var controller = require("../controllers/ProjectController");

router.post('/',function(req,res,next){
  controller.addProject(req.body,(user,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(user);
  });
});

router.delete('/:projectId',function(req,res,next){
  controller.deleteProject(req.params.projectId,(project,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(project);
  });
});

router.get('/:projectId',function(req,res,next){
    controller.getProjectStart(req.params.projectId,(file,err) => {
      if(err)
        return res.json({'error' : err.toString() });
      return res.json(file);
    })
});


module.exports = router;
