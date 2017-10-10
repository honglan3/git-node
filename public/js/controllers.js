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
.controller("AppCtrl",['$scope','Alertify','$log','$rootScope','UserService','$location',function($scope,Alertify,$log,$rootScope,UserService,$location){

    $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
        $log.log("userDetails - ",userDetails);

        UserService.authenticate(userDetails['provider'],userDetails['token'])
        .then((data) => {
            $log.log("JWT data = ",data);
            window.localStorage.setItem('jwt',data.toString());
            return UserService.getUserByEmailId(userDetails.email);
        })
        .then((data) => {
            if(!data)
                return UserService.addUser({
                    "email" : userDetails.email,
                    "pic_url" : userDetails.imageUrl,
                    "account_id" : userDetails.uid,
                    "account_type" : userDetails.provider
                });
            else
                return data;
        })
        .then((data) => {
            UserService.setUser(data);
        })
    }) 

    $rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){})
    
    $scope.$watch(UserService.loggedIn(),function(newValue,oldValue){
        if(!newValue)
            $location.path('login');
    })

    $scope.$on('login-success',function(){
        $log.log($location.path());
        if($location.path() == "/login")
            $location.path('/');
    })

}])
.controller('HomeCtrl',['$scope','$log','HomeService','UserService','Alertify','UserService',function($scope,$log,HomeService,UserService,Alertify,UserService){

    Alertify.set('notifier','position', 'top-center');
    
    $scope.projects = [];

    $scope.user = UserService.getUser();
    
    $scope.members = [];

    HomeService.getProjectsByUserId($scope.user['_id']).then((data) => {
        console.log($scope.projects);
        $scope.projects = data;
    });

    $scope.addProject = () => {
        var project = {
            'name' : $scope.name,
            'master_user' : $scope.user['_id'],
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

    $scope.addCollaborator = () => {
        var emailId = $scope.emailId;
        $log.log("email = ",emailId);
        if(emailId == $scope.user.email){
            Alertify.error('You cannot add yourself !!');
            return;
        }
        UserService.getUserByEmailId(emailId)
        .then((data) => {
            $log.log("data = ",data);
            $log.log('success');
            if(data == null){
                Alertify.error('No Such Registered User Exists');
            }
            else if($scope.members.map((item) => {return item['email'] }).indexOf(data['email']) >= 0)
                Alertify.error('Member Already Added');
            else{
                $scope.members.push(data);
                Alertify.success('Member Added Successfully');
            }
        });
    }

    $scope.removeMember = function(index){
        if(index < 0 || index >= $scope.members.length)
            return;
        $scope.members.splice(index,1);
    }

}])
.controller('FileCtrl',['$scope','$log','FileService','HomeService','$routeParams','Alertify','UserService',function($scope,$log,FileService,HomeService,$routeParams,Alertify,UserService){

    $scope.user = UserService.getUser();

    HomeService.getProjectById($routeParams.projectId).then((project) => {
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
                    $scope.files = angular.copy(data);
                    $log.log("filed = ",$scope.files);
                })
                .catch((err) => {
                    $log.log(err);
                    $scope.files = [];
                    $scope.parent = null;
                })
        }
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
                $scope.files = angular.copy(data);
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
            'master_user' : $scope.user['_id'],
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
.controller('CommitCtrl',['$scope','$log','$routeParams','Alertify','FileService','CommitService','UserService',function($scope,$log,$routeParams,Alertify,FileService,CommitService,UserService){

    $scope.commits = [];

    $scope.file = null;

    $scope.existingCommitEditor = null;
    $scope.forkCommit = null;

    $scope.user = UserService.getUser();

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
        $scope.file = angular.copy(data);
        return CommitService.getCommitsByFileId($routeParams.fileId);
    })
    .catch((err) => {
        $log.log(err);
    })
    .then((data) => {
        $log.log("commits = ",data);
        $scope.commits = angular.copy(data);
    })

    $scope.aceLoaded = function(_editor) {
       $scope.existingCommitEditor = _editor;
       $scope.existingCommitEditor.getSession().on("change",function(e){
          $scope.commit['content'] = angular.copy($scope.existingCommitEditor.getValue());
       });
    };

    $scope.forkAceLoaded = function(_editor){
        $scope.forkEditor = _editor;
        $scope.forkEditor.getSession().on("change",function(e){
           $scope.fork['content'] = angular.copy($scope.forkEditor.getValue());
        });
    }

    $scope.openFork = function(commitId){
        $scope.fork = angular.copy($scope.commits.filter((item) => {
            return item['_id'] == commitId;
        })[0]);
        if($scope.fork['content'] != null)
            $scope.forkEditor.setValue($scope.fork['content'],1);
        else
            $scope.forkEditor.setValue('',1);
        $("#forkCommitModal").modal('show');
    }


    $scope.openCommit = function(commitId){
        $scope.commit = angular.copy($scope.commits.filter((item) => {
                        return item['_id'] == commitId;
                    })[0]);
        if($scope.commit['content'] != null)
            $scope.existingCommitEditor.setValue($scope.commit['content'],1);
        else
            $scope.existingCommitEditor.setValue('',1);
        $("#openCommitModal").modal('show');
    }

    $scope.forkCommit = function(){
        delete $scope.fork['_id'];
        CommitService.addNewCommit(angular.copy($scope.fork))
        .then((data) => {
            $log.log("data = ",data);
            Alertify.success('Forked Successfully');
            $scope.commits.push(angular.copy(data));
        })
        .catch((error) => {
            $log.log("error = ",error);
            Alertify.error('Some Error Occurred');
        })
    }
    
    $scope.saveCommit = function(){
        CommitService.updateCommit($scope.commit['_id'],angular.copy($scope.commit))
        .then((data) => {
            $log.log("data = ",data);
            Alertify.success('Commit Updated Successfully');
        })
        .catch((error) => {
            $log.log("error = ",error);
            Alertify.error('Some Error Occurred');
        })
    }

    $scope.merge = [];

    $scope.addToMergeList = function(index){
        if($scope.merge.length == 2 && $scope.merge.indexOf($scope.commits[index]) == -1){
            $scope.checks[index] = false;
            Alertify.error('Only two commits can be added for merge, try removing other and then add this');
            return;
        }
        if($scope.merge.indexOf($scope.commits[index]) > -1){
            $scope.merge.splice($scope.merge.indexOf($scope.commits[index]),1);
        }
        else{
            $log.log("pushed to array");
            $scope.merge.push($scope.commits[index]);
        }
    }

    $scope.mergeItems = function(){
        CommitService.mergeFilesByCommit($scope.merge[0],$scope.merge[1],$scope.user['_id'])
        .then((data) => {
            $scope.commits.push(angular.copy(data));
        })
        .catch((error) => {
            $log.log("error = ",error);
            Alertify.error('Some Error Occurred');
        })
    }

}]);