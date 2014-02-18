'use strict';

describe('Controller: StructureCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var StructureCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StructureCtrl = $controller('StructureCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
