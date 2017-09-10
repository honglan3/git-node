angular.module("gitApp.services")
.service('FileService',['$http','$q',function($http,$q){

    this.getFolderContentsById = function(fileId){
        var defer = $q.defer();
        $http.get('http://localhost:3000/file/'+fileId+'/folderContents') 
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

    this.addNewFile = function(file){
        var defer = $q.defer();
        $http.post('http://localhost:3000/file',angular.copy(file))
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

    this.deleteFile = function(fileId){
        var defer = $q.defer();
        $http.delete('http://localhost:3000/project/'+fileId)
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

    this.updateFile = function(fileId,file){
        var defer = $q.defer();
        $http.put('http://localhost:3000/project/'+fileId,angular.copy(file))
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