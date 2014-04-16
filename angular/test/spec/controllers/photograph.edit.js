'use strict';

describe('Controller: PhotographEditCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var PhotographEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhotographEditCtrl = $controller('PhotographEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
