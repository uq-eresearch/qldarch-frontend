'use strict';

describe('Controller: OtherJsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var OtherJsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OtherJsCtrl = $controller('OtherJsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
