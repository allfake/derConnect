'use strict';

angular.module('derConnectApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth) {
    $scope.pis = [];
    $scope.pi = {};
    $scope.pi.newSerialNumber = "";

    $http.get('/api/pis').success(function(pis) {
      $scope.pis = pis;
      socket.syncUpdates('pi', $scope.pis, function() {
        $scope.dialogAddPi = 0;
      });
    });

    $scope.addPi = function() {
      console.log($scope.newSerialNumber);
      if($scope.pi.newSerialNumber === '') {
        return;
      }
      $http.post('/api/pis', { user_id: Auth.getCurrentUser()._id , serial_number: $scope.pi.newSerialNumber });
      $scope.pi.newSerialNumber = '';
    };

    $scope.deletePi = function(pi) {
      $http.delete('/api/pis/' + pi._id);
    };

    $scope.playSound = function(pi) {
      socket.playSound(pi);
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pi');
    });

  });