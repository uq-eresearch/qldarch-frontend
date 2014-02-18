'use strict';

describe('Controller: FirmsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var FirmsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FirmsCtrl = $controller('FirmsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
