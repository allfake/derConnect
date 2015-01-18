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

      if (!deviceType || !deviceType.type || !deviceType.name || deviceType.type == '' || deviceType.identifier == '') {
        toastr["error"]("Please fill all field");
        return;
      }


      $http.post('/api/deviceTypes/', { name: deviceType.name , type: deviceType.type , transform_function: deviceType.transform_function, identifier: deviceType.identifier, active: true }).success(function(data) {
        $scope.deviceType.transform_function = 'function(json) { return json;}';
      });
      $scope.deviceType = {};

    }


    $scope.updateDeveiceType = function (deviceType) {

      if (!deviceType || !deviceType.type || !deviceType.name || !deviceType.transform_function || deviceType.type == '' || deviceType.name == '' || deviceType.transform_function == '') {
        toastr["error"]("Please fill all field");
        return;
      }

      $http.put('/api/deviceTypes/' + deviceType._id, { name: deviceType.name , type: deviceType.type , transform_function: deviceType.transform_function, identifier: deviceType.identifier, active: true });

    }

    $scope.deleteDeveiceType = function (deviceType) {

      $http.delete('/api/deviceTypes/' + deviceType._id);

    }

  });
