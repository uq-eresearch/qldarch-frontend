'use strict';

describe('Controller: ArchitectrelationshipsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var ArchitectrelationshipsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArchitectrelationshipsCtrl = $controller('ArchitectrelationshipsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
