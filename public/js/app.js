angular.module("gitApp",["ngRoute","ngtimeago","gitApp.controllers","gitApp.services"])
    .directive('openBootstrapModal',function(){
        return function(scope,element,attrs){
            element.on('click',() => {
                var modalId = attrs['modalId'];
                $('#'+modalId).modal('toggle');
            });
        };
    })
    .config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true,
            rewriteLinks: false
          });

        $routeProvider.
            when('/', {
                templateUrl: '../views/home.html',
                controller: 'HomeCtrl'
            }).
            when('/project/:projectId',{
                templateUrl: '../views/project-view.html',
                controller: 'FileCtrl'
            }).
            when('/file/:fileId',{
                templateUrl: '../views/commits.html',
                controller: 'CommitCtrl'
            });
    }]);