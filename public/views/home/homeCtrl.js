var app = angular.module('coderFriends');

app.controller('homeCtrl', function($scope, friends){
$scope.test = "Jacob is a pooface"
$scope.friends = friends;

})