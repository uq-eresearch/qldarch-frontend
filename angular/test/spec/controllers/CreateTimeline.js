'use strict';

describe('Controller: CreatetimelineCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var CreatetimelineCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreatetimelineCtrl = $controller('CreatetimelineCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
