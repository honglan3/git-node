angular.module("gitApp.services",[])
.service('HomeService',['$http','$q',function($http,$q){

    this.getProjectsByUserId = function(userId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/user/'+userId+'/projects') 
            .then((data) => {
                if(!data.data)
                    defer.reject({'error' : 'Some error occurred'});
                else if(data.data.error)
                    defer.reject({'error' : data.data.error});
                else
                    defer.resolve(data.data);
            });
        return defer.promise;
    }

    this.getProjectById = function(projectId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/project/'+projectId) 
            .then((data) => {
                if(!data.data)
                    defer.reject({'error' : 'Some error occurred'});
                else if(data.data.error)
                    defer.reject({'error' : data.data.error});
                else
                    defer.resolve(data.data);
            });
        return defer.promise;
    }

    this.addNewProject = function(project){
        var defer = $q.defer();
        $http.post('http://localhost:3000/project',angular.copy(project))
            .then((data) => {
                if(!data.data)
                    defer.reject({'error' : 'Some error occurred'});
                else if(data.data.error)
                    defer.reject({'error' : data.data.error});
                else
                    defer.resolve(data.data);
            });
        return defer.promise;
    }

    this.deleteProject = function(projectId){
        var defer = $q.defer();
        $http.delete('http://localhost:3000/project/'+projectId)
            .then((data) => {
                if(!data.data)
                    defer.reject({'error' : 'Some error occurred'});
                else if(data.data.error)
                    defer.reject({'error' : data.data.error});
                else
                    defer.resolve(data.data);
            });
        return defer.promise;
    }

    this.addUserToProject = function(projectId,userId){
        var defer = $q.defer();
        $http.put('http://localhost:3000/addToProject/'+projectId+'/'+userId)
            .then((data) => {
                if(!data.data)
                    defer.reject({'error' : 'Some error occurred'});
                else if(data.data.error)
                    defer.reject({'error' : data.data.error});
                else
                    defer.resolve(data.data);
            });
        return defer.promise;
    }
}])