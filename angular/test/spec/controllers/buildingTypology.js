'use strict';

describe('Controller: BuildingtypologyCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var BuildingtypologyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuildingtypologyCtrl = $controller('BuildingtypologyCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
