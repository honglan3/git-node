angular.module("gitApp",["ngRoute","gitApp.controllers","gitApp.services"])
    .directive('openBootstrapModal',function(){
        return function(scope,element,attrs){
            element.on('click',() => {
                var modalId = attrs['modalId'];
                $('#'+modalId).modal('show');
            });
        };
    })
    .config(["$routeProvider",function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: '../views/home.html',
                controller: 'HomeCtrl'
            }).
            when('/project/:projectId',{
                templateUrl: '../views/project-view.html',
                controller: 'ProjectCtrl'
            }).
            when('/file/:fileId',{
                templateUrl: '../views/commits.html',
                controller: 'CommitCtrl'
            });
    }]);