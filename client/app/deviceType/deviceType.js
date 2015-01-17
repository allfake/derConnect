'use strict';

angular.module('derConnectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('deviceType', {
        url: '/deviceType',
        templateUrl: 'app/deviceType/deviceType.html',
        controller: 'DeviceTypeCtrl'
      });
  });