var express = require('express');
var router = express.Router();
var controller = require("../controllers/CommitController");
var mergeController = require("../controllers/MergeController");

router.post('/',function(req,res,next){
    controller.addCommit(req.body,(commit,err) => {
      if(err)
        return res.json({'error' : err.toString() });
      return res.json(commit);
    });
});

router.get('/:commitId',function(req,res,next){
    controller.getCommit(req.params.commitId,(commit,err) => {
      if(err)
        return res.json({'error' : err.toString() });
      return res.json(commit);
    });
});

router.put('/:commitId',function(req,res,next){
    controller.updateCommit(req.params.commitId,req.body,(commit,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(commit);
    })
});

router.get('/project/:projectId',function(req,res,next){
    controller.getCommitsByProjectId(req.params.projectId,(commits,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(commits);
    });
});

router.get('/project/:projectId/user/:userId',function(req,res,next){
    controller.getCommitsByProjectIdAndUserId(req.params.projectId,req.params.userId,(commits,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(commits);
    });
});

router.get('/file/:fileId',function(req,res,next){
    controller.getCommitsByFileId(req.params.fileId,(commits,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(commits);
    });
});

router.get('/file/:fileId/user/:userId',function(req,res,next){
    controller.getCommitsByFileIdAndUserId(req.params.fileId,req.params.userId,(commits,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(commits);
    });
});

router.get('/merge/:commitId1/:commitId2/:userId',function(req,res,next){
    mergeController.mergeFiles(req.params.commitId1,req.params.commitId2,req.params.userId,(commit,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(commit);
    });
})

module.exports = router;
