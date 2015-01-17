'use strict';

describe('Controller: DeviceTypeCtrl', function () {

  // load the controller's module
  beforeEach(module('derConnectApp'));

  var DeviceTypeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeviceTypeCtrl = $controller('DeviceTypeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
