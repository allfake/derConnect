'use strict';

describe('Filter: deviceReceiveData', function () {

  // load the filter's module
  beforeEach(module('derConnectApp'));

  // initialize a new instance of the filter before each test
  var deviceReceiveData;
  beforeEach(inject(function ($filter) {
    deviceReceiveData = $filter('deviceReceiveData');
  }));

  it('should return the input prefixed with "deviceReceiveData filter:"', function () {
    var text = 'angularjs';
    expect(deviceReceiveData(text)).toBe('deviceReceiveData filter: ' + text);
  });

});
