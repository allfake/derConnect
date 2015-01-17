'use strict';

angular.module('derConnectApp')
  .controller('DeviceTypeCtrl', function ($scope, $http, socket) {
    
    $scope.typeList = [
         {title: 'action'},
         {title: 'receive'},
         {title: 'schedule'}
      ];  


    $http.get('/api/deviceTypes/').success(function(deviceTypes) {

      $scope.deviceTypes = deviceTypes;
      
      socket.syncUpdates('deviceType', $scope.deviceTypes, function(event) {

      });
    });


    $scope.addDeveiceType = function (deviceType) {

      if (!deviceType || !deviceType.type || !deviceType.name || deviceType.type == '' || deviceType.name == '') {
        toastr["error"]("Please fill all field");
        return;
      }


      $http.post('/api/deviceTypes/', { name: deviceType.name , type: deviceType.type , active: true });
      $scope.deviceType = {};

    }


    $scope.updateDeveiceType = function (deviceType) {

      if (!deviceType || !deviceType.type || !deviceType.name || deviceType.type == '' || deviceType.name == '') {
        toastr["error"]("Please fill all field");
        return;
      }

      $http.put('/api/deviceTypes/' + deviceType._id, { name: deviceType.name , type: deviceType.type , active: true });

    }

    $scope.deleteDeveiceType = function (deviceType) {

      $http.delete('/api/deviceTypes/' + deviceType._id);

    }

  });
