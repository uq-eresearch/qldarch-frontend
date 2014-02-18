'use strict';

describe('Controller: ArchitectsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var ArchitectsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArchitectsCtrl = $controller('ArchitectsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
