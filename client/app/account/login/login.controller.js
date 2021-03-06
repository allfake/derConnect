'use strict';

angular.module('derConnectApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {

    $('body').loading('stop');
    $('body').loading('stop');

    $scope.user = {};
    $scope.errors = {};
    $scope.user.email = "test@test.com";
    $scope.user.password = "test";
    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
