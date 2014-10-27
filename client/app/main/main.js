'use strict';

angular.module('derConnectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/front',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });