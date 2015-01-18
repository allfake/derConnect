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

          angular.forEach(pi.devices, function (d) {
            angular.forEach(d.receive, function (value) {
              socket.piReceive(d.type, d.uuid, pi, deviceTypes);
            });
          });
        }


        socket.syncUpdatesPi('pi', $scope.pis, function(event) {
                 
        });
      });
    });
    
    $scope.transform_reveice = function(device, receive) {

      angular.forEach($scope.deviceTypes, function(value, key) {
        if (device.type == value.name) {

        }
      });

      var transformFunction = '';
    }

    $scope.addDevice = function(pi, device, toggle) {
      
      if (!$scope.validateDevice(device)) {
        return;
      }

      if (pi.devices.length == 0) {
        pi.devices = []; 
      }

      pi.devices.push(device);
      device.receive = [];

      var defaultReceive = {};
      defaultReceive.name = 'My receive';

      device.receive.push(defaultReceive);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {
        // $scope[toggle] = !$scope[toggle];
      });
    };

    $scope.addPi = function() {
      if($scope.pi.newSerialNumber === '') {
        return;
      }
      $http.post('/api/pis', { user_id: Auth.getCurrentUser()._id , serial_number: $scope.pi.newSerialNumber }).success(function(data) {
      });
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

    $scope.addAction = function(pi, device, action, toggle) {

      if (!$scope.validateAction(action)) {
        return;
      }

      if (device.action.length == 0) {
        device.action = []; 
      }
      device.action.push(action);
      
      $http.put('/api/pis/' + pi._id, pi).success(function (data) {
        // $scope[toggle] = !$scope[toggle];
      });
    }

    $scope.takeAction = function (pi, action) {
      socket.piAction(pi, action);
    }

    $scope.addSchedule = function(pi, device, schedule) {

      if (!$scope.validateSchdule(schedule)) {
        return;
      } 

      if (device.schedule.length == 0) {
        device.schedule = []; 
      }
      device.schedule.push(schedule);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {
        // $scope.scheduleEditting = false;
      });
    }

    $scope.addReceive = function(pi, device, receive) {
      if (device.receive.length == 0) {
        device.receive = []; 
      }
      device.receive.push(receive);
      
      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }


    $scope.removeDevice = function(pi, device) {
      if (pi.devices.length == 0) {
        pi.devices = []; 
      }
      
      pi.devices = _.remove(pi.devices, function(s) { return s != device; });
      pi.devices = _.without(pi.devices, null);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.removeAction = function(pi, device, action) {
      
      device.action = _.remove(device.action, function(s) { return s != action; });
      device.action = _.without(device.action, null);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.removeReceive = function(pi, device, receive) {
      if (device.receive.length == 0) {
        device.receive = []; 
      }
      
      device.receive = _.remove(device.receive, function(s) { return s != receive; });
      device.receive = _.without(device.receive, null);

      $http.put('/api/pis/' + pi._id, pi).success(function (data) {

      });
    }

    $scope.removeSchedule = function(pi, device, schedule) {
      if (device.schedule.length == 0) {
        device.schedule = []; 
      }

      device.schedule = _.remove(device.schedule, function(s) { return s != schedule; });
      device.schedule = _.without(device.schedule, null);
      
      $http.put('/api/pis/' + pi._id, pi).success(function (data) {
        
      });
    }

    $scope.updateSchedule = function(pi, schedule) {
      if (!$scope.validateSchdule(schedule)) {
        return;
      }
    }


    $scope.validateDevice = function (device) {
              
      if(!!!device || !device.name || !device.uuid || !device.type) {
        toastr["error"]("Please fill all field")
        return false;
      } else {
        return true;
      }

    }

    $scope.validateAction = function (action) {
              
      if(!!!action || !action.data || !action.name) {
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
              
      if(!!!schedule || !schedule.interval || !schedule.data || !schedule.name) {
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