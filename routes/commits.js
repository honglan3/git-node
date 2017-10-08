var express = require('express');
var router = express.Router();
var controller = require("../controllers/CommitController");
var mergeController = require("../controllers/MergeController");
var downloadController = require("../controllers/DownloadController");
var uuid = require("uuid/v4");
var fs = require('fs');

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

router.get('/download/:projectId',function(req,res,next){
    downloadController.createFolder(req.params.projectId,(zip,err) => {
        if(err)
            return res.json({'error' : err.toString()});
        var file = uuid().toString()+'.zip';
        zip.writeToFile(file,function(){
            res.setHeader('Content-Type', 'application/zip');
            res.end(fs.readFileSync(file),'binary');
            fs.unlink(file);
        });
    });
})

router.get('/fetchDB/:projectId',function(req,res,next){
    downloadController.fetchFromServer(req.params.projectId,(db,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json(db);
    });
})

router.post('/pushToDB',function(req,res,next){
    downloadController.pushToDB(req.body,(response,err) => {
        if(err)
            return res.json({'error' : err.toString() });
        return res.json({'success' : response});
    })
});


module.exports = router;
