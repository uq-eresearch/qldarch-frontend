'use strict';

describe('Controller: UserUgcsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var UserUgcsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserUgcsCtrl = $controller('UserUgcsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
