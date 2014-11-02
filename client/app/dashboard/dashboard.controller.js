'use strict';

angular.module('derConnectApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth, $modal) {
    $scope.pis = [];
    $scope.pi = {};
    $scope.pi.newSerialNumber = "";



    $http.get('/api/pis').success(function(pis) {
      $scope.pis = pis;
      socket.piOnline($scope.pis);
      socket.piOffline($scope.pis);
      
      socket.syncUpdates('pi', $scope.pis, function(event) {

      });
    });

    $scope.options = {
      type: ['Play song', 'Open light', 'Close light'],
    };

    $scope.addPi = function() {
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

    $scope.updatePi = function(pi) {
      // $http.put('/api/pis/' + pi._id, { pi });
    }

    $scope.addSchedule = function(pi, schedule) {
      if (pi.schedule.length == 0) {
        pi.schedule = []; 
      }
      pi.schedule.push(schedule);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.deleteSchedule = function(pi, schedule) {
      if (pi.schedule.length == 0) {
        pi.schedule = []; 
      }

      pi.schedule = _.remove(pi.schedule, function(s) { return s != schedule; });

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {
        schedule = {}
      });
    }

    $scope.updateSchedule = function(pi, schedule) {

    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pi');
    });

  });