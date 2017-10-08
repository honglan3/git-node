angular.module("gitApp",["ngRoute","ngtimeago","gitApp.controllers","gitApp.services"])
    .directive('openBootstrapModal',function(){
        return function(scope,element,attrs){
            element.on('click',() => {
                var modalId = attrs['modalId'];
                $('#'+modalId).modal('toggle');
            });
        };
    })
    .service('DB',['$http','$q',function($http,$q){
        
        this.data = null;

        this.getDB = function(){
            var defer = $q.defer();
            if(!this.data){
                $http.get('js/DB.json').then((data) => {
                    this.data = angular.copy(data.data);
                    defer.resolve(this.data);
                })
            }
            else
                defer.resolve(this.data);
            return defer.promise;
        }

        this.updateDB = function(db){
            $http.post('/server/updateDB',db)
            .then((data) => {
                if(data.data.success){
                    this.data = angular.copy(db);
                } 
            })
        }

    }])
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