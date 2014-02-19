'use strict';

describe('Controller: FirmrelationshipsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var FirmrelationshipsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FirmrelationshipsCtrl = $controller('FirmrelationshipsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
