'use strict';

angular.module('derConnectApp')
  .controller('DashboardCtrl', function ($scope, $http, socket) {
    $scope.pis = [];

    $http.get('/api/pis').success(function(pis) {
      $scope.pis = pis;
      socket.syncUpdates('pi', $scope.pis);

    });

    $scope.addPi = function() {
      if($scope.newSerialNumber === '') {
        return;
      }
      $http.post('/api/pis', { serial_number: $scope.newSerialNumber });
      $scope.newSerialNumber = '';
    };

    $scope.deletePi = function(pi) {
      $http.delete('/api/pis/' + pi._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pi');
    });

  });