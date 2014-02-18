'use strict';

describe('Controller: StructuresCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var StructuresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StructuresCtrl = $controller('StructuresCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
