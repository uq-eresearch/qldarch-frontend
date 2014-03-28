'use strict';

describe('Controller: MapviewerCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var MapviewerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapviewerCtrl = $controller('MapviewerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
