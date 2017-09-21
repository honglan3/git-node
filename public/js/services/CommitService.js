angular.module("gitApp.services")
.service('CommitService',['$http','$q',function($http,$q){

    this.getCommitById = function(commitId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/commit/'+commitId) 
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

    this.addNewCommit = function(commit){
        var defer = $q.defer();
        $http.post('http://localhost:3000/commit',angular.copy(commit))
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

    this.updateCommit = function(commitId,commit){
        var defer = $q.defer();
        $http.put('http://localhost:3000/commit/'+commitId,angular.copy(commit))
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

    this.getCommitsByProjectId = function(projectId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/commit/project/'+projectId) 
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

    this.getCommitsByProjectIdAndUserId = function(projectId,userId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/commit/project/'+projectId+'/user/'+userId) 
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
    
    this.getCommitsByFileId = function(fileId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/commit/file/'+fileId) 
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

    this.getCommitsByFileIdAndUserId = function(fileId,userId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/commit/file/'+fileId+'/user/'+userId) 
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

    this.mergeFilesByCommit = function(commit1,commit2,userId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/commit/merge/'+commit1['_id']+'/'+commit2['_id']+'/'+userId) 
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