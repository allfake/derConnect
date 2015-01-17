'use strict';

angular.module('derConnectApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth, $modal) {
    $scope.pis = [];
    $scope.pi = {};
    $scope.pi.newSerialNumber = "";

    $http.get('/api/deviceTypes/').success(function(deviceTypes) {

      $scope.deviceTypes = deviceTypes;
      
      socket.syncUpdates('deviceType', $scope.deviceTypes, function(event) {
        
      });
    });

    $http.get('/api/pis/me/').success(function(pis) {

      $scope.rescan = function (pi) {
        pi.bles = [];
        socket.piBleReScan();
      }

      $scope.pis = pis;
      
      socket.piOnline($scope.pis);
      socket.piOffline($scope.pis);


      for (var i = 0; i < $scope.pis.length; i++) {
        var pi = $scope.pis[i];

        pi.bles = [];
        socket.piReceive('bleList', pi.serial_number, pi);

        angular.forEach(pi.receive, function (value) {
          socket.piReceive(value.type, pi.serial_number, pi);
        });

      }


      socket.syncUpdatesPi('pi', $scope.pis, function(event) {
               
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

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.addAction = function(pi, action) {
      if (pi.action.length == 0) {
        pi.action = []; 
      }
      pi.action.push(action);
      
      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.takeAction = function (pi, action) {
      socket.piAction(pi, action);
    }

    $scope.addSchedule = function(pi, schedule, editting) {

      if (!$scope.validateSchdule(schedule)) {
        return;
      } 

      if (pi.schedule.length == 0) {
        pi.schedule = []; 
      }
      pi.schedule.push(schedule);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {
        $scope.scheduleEditting = false;
      });
    }

    $scope.addReceive = function(pi, receive) {
      if (pi.receive.length == 0) {
        pi.receive = []; 
      }
      pi.receive.push(receive);
      
      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.removeAction = function(pi, action) {
      if (pi.action.length == 0) {
        pi.action = []; 
      }
      pi.action.push(action);
      
      pi.action = _.remove(pi.action, function(s) { return s != action; });
      pi.action = _.without(pi.action, null);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.removeReceive = function(pi, receive) {
      if (pi.receive.length == 0) {
        pi.receive = []; 
      }
      pi.receive.push(receive);
      
      pi.receive = _.remove(pi.receive, function(s) { return s != receive; });
      pi.receive = _.without(pi.receive, null);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.removeSchedule = function(pi, schedule) {
      if (pi.schedule.length == 0) {
        pi.schedule = []; 
      }

      pi.schedule = _.remove(pi.schedule, function(s) { return s != schedule; });
      pi.schedule = _.without(pi.schedule, null);
      
      $http.put('/api/pis/' + pi._id, pi).success(function (data) {
        
      });
    }

    $scope.updateSchedule = function(pi, schedule) {
      if (!$scope.validateSchdule(schedule)) {
        return;
      }
    }

    $scope.validateAction = function (schedule) {
              
      if(!!!schedule || !schedule.interval || !schedule.data || !schedule.type || !schedule.name) {
        toastr["error"]("Please fill all field")
        return false;
      } else {
        return true;
      }

    }

    $scope.validateReceive = function (schedule) {
              
      if(!!!schedule || !schedule.interval || !schedule.data || !schedule.type || !schedule.name) {
        toastr["error"]("Please fill all field")
        return false;
      } else {
        return true;
      }

    }

    $scope.validateSchdule = function (schedule) {
              
      if(!!!schedule || !schedule.interval || !schedule.data || !schedule.type || !schedule.name) {
        toastr["error"]("Please fill all field")
        return false;
      } else {
        return true;
      }

    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('pi');
    });

  });