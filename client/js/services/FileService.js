angular.module("gitApp.services")
.service('FileService',['$http','$q','DB',function($http,$q,DB){

    this.getFileById = function(fileId){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var files = data.files.filter((item) => {
                return item['_id'] == fileId;
            })
            defer.resolve(files[0]);
        });
        return defer.promise;
    }

    this.getFolderContentsById = function(fileId){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var files = data.files.filter((item) => {
                return item['parent'] == fileId;
            });
            defer.resolve(files);
        });
        return defer.promise;
    }

    this.addNewFile = function(file){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var count = data.files.length;
            data.files.push(angular.copy(file));
            DB.updateDB(data);
            if(data.files.length > count)
                defer.resolve(file);
        });
        return defer.promise;
    }

    this.updateFile = function(fileId,file){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var index = -1;
            for(var i = 0 ; i < data.files.length ; i++){
                if(data.files['_id'] == fileId){
                    index = i;
                    break;
                }
            }
            if(index > -1){
                data.files[index] = angular.copy(file);
                DB.updateDB(data);
                defer.resolve(data.files[index]);
            }
        });
        return defer.promise;
    }

    this.getProjectStartingPoint = function(projectId){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var file = data.files.filter((item) => {
                return item['project_entry_point'];
            });
            defer.resolve(file[0]);
        });
        return defer.promise;
    }
}])