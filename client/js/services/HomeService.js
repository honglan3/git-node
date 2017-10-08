angular.module("gitApp.services",[])
.service('HomeService',['$http','$q','DB',function($http,$q,DB){

    this.getProjectsByUserId = function(){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            defer.resolve([data.project]);
        });
        return defer.promise;
    }

    this.getProjectById = function(){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            defer.resolve(data.project);
        });
        return defer.promise;
    }    

}])