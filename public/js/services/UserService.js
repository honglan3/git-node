angular.module("gitApp.services")
.service('UserService',['$http','$q','$rootScope',function($http,$q,$rootScope){

    this.user = null;

    this.loggedIn = function(){
        if(window.localStorage.getItem("jwt") != null)
            return this.user != null;
    }

    this.setUser = function(user){
        this.user = angular.copy(user);
        if(this.user != null)
            $rootScope.$broadcast('login-success',{});
    }

    this.getUser = function(){
        return angular.copy(this.user);
    }

    this.getUserByEmailId = (email) => {
        var defer = $q.defer();
        $http.get('http://localhost:3000/user/'+email)
            .then((data) => {
                console.log(data);
                if(!data.data || data.data['error'])
                    defer.resolve(null);
                else{
                    defer.resolve(data.data);
                    console.log("data");
                }
            })
        return defer.promise;
    }

    this.authenticate = function(provider,accessToken){
        var defer = $q.defer();
        $http.post('http://localhost:3000/auth/'+provider,{'accessToken' : accessToken})
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

    this.addUser = (user) => {
        var defer = $q.defer();
        $http.post('http://localhost:3000/user/',angular.copy(user))
        .then((data) => {
            if(!data.data || data.data.error)
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