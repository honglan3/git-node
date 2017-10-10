angular.module("gitApp",["ngRoute","ngtimeago","gitApp.controllers","gitApp.services",'socialLogin'])
    .directive('openBootstrapModal',function(){
        return function(scope,element,attrs){
            element.on('click',() => {
                var modalId = attrs['modalId'];
                $('#'+modalId).modal('toggle');
            });
        };
    })
    .factory('jwtInterceptor',function(){
        return {
            request: function(config) {
              config.headers['Authorization'] = 'JWT '+window.localStorage.getItem("jwt");
              return config;
            },
    
            requestError: function(config) {
              alertify.error('Network Connection Failed');
              console.log("requestError = ",config);
              return config;
            },
    
            response: function(res) {
              console.log("response = ",res);
              return res;
            },
    
            responseError: function(res) {
              alertify.error('Network Connection Failed');
              return res;
            }
        }
    })
    .config(["$routeProvider","$httpProvider","$locationProvider",'socialProvider',function($routeProvider,$httpProvider,$locationProvider,socialProvider){

        socialProvider.setFbKey({appId: "145902422691652", apiVersion: "v2.10"});

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true,
            rewriteLinks: false
          });

        $httpProvider.interceptors.push('jwtInterceptor');

        $routeProvider.
            when('/', {
                templateUrl: '../views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/login',{
                templateUrl : '../views/login.html'
            })
            .when('/project/:projectId',{
                templateUrl: '../views/project-view.html',
                controller: 'FileCtrl'
            }).
            when('/file/:fileId',{
                templateUrl: '../views/commits.html',
                controller: 'CommitCtrl'
            });
    }]);