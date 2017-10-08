angular.module("gitApp.controllers",["ui.ace","Alertify"])
.directive("commitList", function() {
    return {
        restrict : "EA",
        link : function(scope,element,attrs){
            var list = attrs["list"];
            scope.$watch(list,function(list){
                console.log("list = ",list);

                for(var i = 0 ; i < list.length ; i++){
                    var tr = angular.element("<tr>");
                    var th = angular.element("<th scope='row'>").text(i+1);
                    tr.append(th);
                    var td = angular.element("<td>").text(list[i]['message']);
                    tr.append(td);
                    td = angular.element("<td>").text(scope.$eval(new Date(list[i]['created_date']).getTime()+"| timeago"));
                    tr.append(td);
                    td = angular.element("<td>").text(list[i]['user']);
                    tr.append(td);
                    var td = angular.element("<td>");
                    td.append("<button class='btn btn-primary' ng-click=\"openCommit('"+list[i]['_id']+"')\">View</button>");
                    tr.append(td);
                    var td = angular.element("<td>");
                    td.append("<button class='btn btn-success' ng-click=\"openFork('"+list[i]['_id']+"')\">Fork Commit</button>");
                    tr.append(td);
                    element.append(tr);
                }
            });
        }
    };
})
.controller("AppCtrl",['$scope','Alertify',function($scope,Alertify){

}])
.controller('HomeCtrl',['$scope','$log','HomeService','Alertify',function($scope,$log,HomeService,Alertify){

    Alertify.set('notifier','position', 'top-center');
    
    $scope.projects = [];

    $scope.members = [];

    HomeService.getProjectsByUserId().then((data) => {
        console.log($scope.projects);
        $scope.projects = data;
    });

    $scope.addProject = () => {
        var project = {
            'name' : $scope.name,
            'master_user' : $scope.user.userId,
            'collaborators' : $scope.members.map((item) => {
                return item['_id'];
            })
        }
        $log.log(project);
        HomeService.addNewProject(project).then((data) => { 
            $scope.projects.push(data);
            $('#addProjectModal').modal('hide');
            $scope.name = null;
            $scope.emailId = null;
            $scope.members = [];
            $scope.addNewProjectForm.$setPristine(true);
        })
    }


    $scope.removeMember = function(index){
        if(index < 0 || index >= $scope.members.length)
            return;
        $scope.members.splice(index,1);
    }

}])
.controller('FileCtrl',['$scope','$log','FileService','HomeService','$routeParams','Alertify','DB',function($scope,$log,FileService,HomeService,$routeParams,Alertify,DB){

    HomeService.getProjectById().then((project) => {
        $scope.project = project;
        $scope.projectId = $routeParams.projectId;
        return FileService.getProjectStartingPoint($scope.projectId);
    })
    .then((data) => {
        $log.log("data = ",data);
        $scope.parent = ["-"];
        $scope.files = [data];
    })

    $scope.files = [];

    $scope.parent = ["-"];

    $scope.user = {
        userId : "59b17ea960571335d055d2c9",
        email : 'bhambri.lakshay@gmail.com'
    };

    $scope.moveToParent = function(){
        if($scope.parent.length > 1){
            $log.log("parent = ",$scope.parent);
            $scope.parent.pop();
            var fileId = $scope.parent[$scope.parent.length-1];
            if(fileId == "-"){
                FileService.getProjectStartingPoint($scope.projectId)
                .then((data) => {
                    $log.log("data = ",data);
                    $scope.parent = ["-"];
                    $scope.files = [data];
                })
                return;
            }
            FileService.getFolderContentsById(fileId)
                .then((data) => {
                    $log.log("file data = ",data);
                    $scope.files = data;
                    $log.log("filed = ",$scope.files);
                })
                .catch((err) => {
                    $log.log(err);
                    $scope.files = [];
                    $scope.parent = null;
                })
        }
    }

    $scope.syncToServer = function(){
        DB.getDB().then((data) => {
            $http.get('http://localhost:3000/commit/fetchDB/'+data.project['_id'])
            .then((data) => {
                DB.updateDB(data.data);
            })
        }); 
    }

    $scope.openFolder = function(fileId){
        $log.log("fileId = ",fileId);
        if(fileId == "-"){
            FileService.getProjectStartingPoint($scope.projectId)
            .then((data) => {
                $log.log("data = ",data);
                $scope.parent = ["-"];
                $scope.files = [data];
            })
            return;
        }
        FileService.getFolderContentsById(fileId)
            .then((data) => {
                $log.log("file data = ",data);
                $scope.parent.push(fileId);
                $scope.files = data;
                $log.log("filed = ",$scope.files);
            }) 
            .catch((err) => {
                $log.log(err);
                $scope.files = [];
                $scope.parent = null;
            })
    }

    $scope.addNewFile = function(){
        if($scope.fileType == "FOLDER"){
            if($scope.fileName.split(".").length > 1){
                Alertify.error('Invalid Folder Name');
                return;
            }
        }
        var file = {
            'name' : $scope.fileName,
            'type' : $scope.fileType,
            'content' : null,
            'master_user' : $scope.user.userId,
            'project' : $scope.projectId,
            'parent' : $scope.parent[$scope.parent.length-1],
            'project_entry_point' : false
        };
        FileService.addNewFile(file)
            .then((data) => {
                $log.log("data = ",data);
                $('#addNewFileModal').modal('hide');
                $scope.files.push(data.file);
                Alertify.success('New File/Folder Created');
            })
    }
}])
.controller('CommitCtrl',['$scope','$log','$routeParams','Alertify','FileService','CommitService','DB',function($scope,$log,$routeParams,Alertify,FileService,CommitService,DB){

    $scope.commits = [];

    $scope.file = null;
    
    $scope.existingCommitEditor = null;
    $scope.forkCommit = null;

    $scope.filter = {
        'user' : null,
        'from' : new Date(),
        'to' : new Date()
    }; 

    $scope.checks = [];

    $scope.filterFunction = function(item){
        $log.log("filter = ",$scope.filter);
        $scope.filter.from = new Date($scope.filter.from);
        $scope.filter.to = new Date($scope.filter.to);
        item['created_date'] = new Date(item['created_date']);
        if($scope.filter.user)
            return item['user'] == $scope.filter.user && item['created_date'].getTime() >= $scope.filter.from.getTime() && item['created_date'].getTime() <= $scope.filter.to.getTime();
        return item['created_date'].getTime() >= $scope.filter.from.getTime() && item['created_date'].getTime() <= $scope.filter.to.getTime();
    }

    FileService.getFileById($routeParams.fileId)
    .then((data) => {
        $log.log("file = ",data);
        $scope.file = data;
        return CommitService.getCommitsByFileId($routeParams.fileId);
    })
    .catch((err) => {
        $log.log(err);
    })
    .then((data) => {
        $log.log("commits = ",data);
        $scope.commits = data;
    })

    $scope.aceLoaded = function(_editor) {
       $scope.existingCommitEditor = _editor;
       $scope.existingCommitEditor.getSession().on("change",function(e){
          $scope.commit['content'] = $scope.existingCommitEditor.getValue();
       });
    };

    $scope.forkAceLoaded = function(_editor){
        $scope.forkEditor = _editor;
        $scope.forkEditor.getSession().on("change",function(e){
           $scope.fork['content'] = $scope.forkEditor.getValue();
        });
    }

    $scope.openFork = function(commitId){
        $scope.fork =   angular.copy($scope.commits.filter((item) => {
            return item['_id'] == commitId;
        })[0]);
        if($scope.fork['content'] != null)
            $scope.forkEditor.setValue($scope.fork['content'],1);
        else
            $scope.forkEditor.setValue('',1);
        $("#forkCommitModal").modal('show');
    }


    $scope.openCommit = function(commitId){
        $scope.commit = $scope.commits.filter((item) => {
                        return item['_id'] == commitId;
                    })[0];
        if($scope.commit['content'] != null)
            $scope.existingCommitEditor.setValue($scope.commit['content'],1);
        else
            $scope.existingCommitEditor.setValue('',1);
        $("#openCommitModal").modal('show');
    }

    $scope.forkCommit = function(){
        delete $scope.fork['_id'];
        $scope.fork['created_date'] = new Date();
        CommitService.addNewCommit($scope.fork)
        .then((data) => {
            $log.log("data = ",data);
            Alertify.success('Forked Successfully');
            $scope.commits.push(data);
        })
        .catch((error) => {
            $log.log("error = ",error);
            Alertify.error('Some Error Occurred');
        })
    }
    
    $scope.saveCommit = function(){
        CommitService.updateCommit($scope.commit['_id'],$scope.commit)
        .then((data) => {
            $log.log("data = ",data);
            Alertify.success('Commit Updated Successfully');
        })
        .catch((error) => {
            $log.log("error = ",error);
            Alertify.error('Some Error Occurred');
        })
    }

    $scope.pushChanges = function(){
        DB.getDB().then((data) => {
            $http.post('http://localhost:3000/commit/pushDB',data);
        })
        .then((data) => {
            if(data.data.success)
                Alertify.success('Changes Pushed To Server');
            else
                Alertify.error('Some error occurred');
        })
    }

}]);