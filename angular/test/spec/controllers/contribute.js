'use strict';

describe('Controller: ContributeCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var ContributeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContributeCtrl = $controller('ContributeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
