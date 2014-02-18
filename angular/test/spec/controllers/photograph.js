'use strict';

describe('Controller: PhotographCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var PhotographCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhotographCtrl = $controller('PhotographCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
