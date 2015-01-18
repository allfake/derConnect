'use strict';

angular.module('derConnectApp')
  .filter('deviceReceiveData', function ($http, $timeout) {
    return function (input, type, deviceTypes) {



      var outPut = 'Waitting for data...';
      if (!input) {
        return outPut;
      }


      angular.forEach(deviceTypes, function(deviceType, key) {

        if (deviceType.name == type) {
          try {
            var evalFunction = eval("(" + deviceType.transform_function + ")");
            outPut = evalFunction(input);
          } catch (e) {
            outPut = "Ops! Somthing wrong."
          }
        }
      });

      return outPut;

    };
  });
