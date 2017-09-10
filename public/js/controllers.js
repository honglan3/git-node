angular.module("gitApp.controllers",["ui.ace"])
.controller("AppCtrl",['$scope',function($scope){

}])
.controller('HomeCtrl',['$scope','HomeService',function($scope,HomeService){
    
    $scope.projects = [];

    $scope.userId = "59b17ea960571335d055d2c9";

    HomeService.getProjectsByUserId($scope.userId).then((data) => {
        console.log($scope.projects);
        $scope.projects = data;
    });

    $scope.addNewProject = (project) => {
        HomeService.addNewProject(project).then((data) => {
            $scope.projects.push(projects);
        })
    }

    $scope.addCollaborator = () => {
        var emailId = $scope.addNewProjectForm.emailId;
        
    }

}])
.controller('ProjectCtrl',['$scope',function($scope){

}])
.controller('CommitCtrl',['$scope',function($scope){

    $scope.aceLoaded = function(_editor) {
        // Options
        _editor.setReadOnly(true);
      };
    
      $scope.aceChanged = function(e) {
        //
      };

}]);