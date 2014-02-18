'use strict';

describe('Controller: BuildingtypologiesCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var BuildingtypologiesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildingtypologiesCtrl = $controller('BuildingtypologiesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
