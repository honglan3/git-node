angular.module("gitApp.services")
.service('CommitService',['$http','$q','DB',function($http,$q,DB){

    this.getCommitById = function(commitId){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var commit = data.commits.filter((item) => {
                return item['_id'] == commitId;
            });
            defer.resolve(commit[0]);
        });
        return defer.promise;
    }

    this.addNewCommit = function(commit){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var count = data.commits.length;
            data.commits.push(angular.copy(commit));
            DB.updateDB(data);
            defer.resolve(commit);
        });
        return defer.promise;
    }

    this.updateCommit = function(commitId,commit){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var index = -1;
            for(var i = 0 ; i < data.commits.length ; i++){
                if(data.commits[i]['_id'] == commitId){
                    index = i;
                    break;
                }
            }
            if(index > -1){
                data.commits[index] = angular.copy(commit);
                DB.updateDB(data);
                defer.resolve(data.commits[index]);
            }
        })
        return defer.promise;
    }
    
    this.getCommitsByFileId = function(fileId){
        var defer = $q.defer();
        DB.getDB().then((data) => {
            var commit = data.commits.filter((item) => {
                return item['file']['_id'] == fileId;
            })
            defer.resolve(commit);
        });
        return defer.promise;
    }
}])