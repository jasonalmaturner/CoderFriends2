var app = angular.module('coderFriends');

app.service('githubService', function($http, $q){

this.login = function() {
	var deferred = $q.defer();
	$http({
		method: 'GET',
		url: '/auth/github'
	})

	return deferred.promise;
}

this.getFollowing = function() {
	var deferred = $q.defer();
	$http({
		method: 'GET',
		url: '/api/github/following'
	}).then(function(res){
		console.log(res);
		deferred.resolve(res.data);
	}, function(err){
		deferred.reject(err);
	});
	return deferred.promise;
}

this.getEvents = function(username) {
	var deferred = $q.defer();
	$http({
		method: 'GET',
		url: '/api/github/' + username + '/activity'
	}).then(function(res){
		console.log(res.data);
		deferred.resolve(res.data)
	}, function(err){
		deferred.reject(err);
	})
	return deferred.promise;
}

})