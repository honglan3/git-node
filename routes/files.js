var express = require('express');
var router = express.Router();
var controller = require("../controllers/FileController");

//needs to be finalized
/**
 * requested structure :
 * {
 *    "name" : "<file name>",
 *    "content" : "<base64 encoded content>",
 *    "type" : 'FOLDER/FILE',
 *    "user" : 'user-id',
 *    "project" : 'project-id'
 * }
 * 
 */
router.post('/',function(req,res,next){
  controller.addFile(req.body,(file,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(file);
  });
});

router.delete('/:fileId',function(req,res,next){
  controller.deleteFile(req.params.fileId,(file,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(file);
  });
});

router.get('/:fileId',function(req,res,next){
  controller.getFileById(req.params.fileId,(file,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(file);
  });
});

router.put('/:fileId',function(req,res,next){
    controller.updateFile(req.params.fileId,file,(file,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(file);
    });
});

router.get('/:fileId/folderContents',function(req,res,next){
  controller.getFolderContents(req.params.fileId,(files,err) => {
      if(err)
        return res.json({'error' : err.toString() });
      return res.json(files);
  });
});

router.get('/project/:projectId/getStartingPoint',function(req,res,next){
  controller.getStartingPoint(req.params.projectId,(file,err) => {
    if(err)
      return res.json({'error' : err.toString() });
    return res.json(file);
  });
});

module.exports = router;
