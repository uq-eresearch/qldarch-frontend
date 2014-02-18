'use strict';

describe('Controller: ArchitectCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var ArchitectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArchitectCtrl = $controller('ArchitectCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
