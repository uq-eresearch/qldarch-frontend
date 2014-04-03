'use strict';

describe('Controller: FilephotographCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var FilephotographCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FilephotographCtrl = $controller('FilephotographCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
