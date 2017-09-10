angular.module("gitApp.services")
.service('UserService',['$http','$q',function($http,$q){

    this.getUserByEmailId = (email) => {
        var defer = $q.defer();
        $http.get('http://localhost:3000/user/'+email)
            .then((data) => {
                if(data.data.error || !data.data)
                    defer.reject({'error' : 'No such user exists'});
                else
                    defer.resolve(data.data);
            })
        return defer.promise;
    }

    this.addUser = (user) => {
        var defer = $q.defer();
        $http.post('http://localhost:3000/user/',angular.copy(user))
        .then((data) => {
            if(data.data.error || !data.data)
                defer.reject({'error' : 'No such user exists'});
            else
                defer.resolve(data.data);
        })
        return defer.promise;
    }

    this.getUserByUserId = (userId) => {
        var defer = $q.defer();
        $http.get('http://localhost:3000/user/userId'+userId)
        .then((data) => {
            if(!data.data)
                defer.reject({'error' : 'Some error occurred'});
            else if(data.data.error)
                defer.reject({'error' : data.data.error});
            else
                defer.resolve(data.data);
        })
        return defer.promise;
    }

}])