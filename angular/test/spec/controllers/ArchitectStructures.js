'use strict';

describe('Controller: ArchitectstructuresCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var ArchitectstructuresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArchitectstructuresCtrl = $controller('ArchitectstructuresCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
