'use strict';

describe('Controller: FirmCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var FirmCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FirmCtrl = $controller('FirmCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
