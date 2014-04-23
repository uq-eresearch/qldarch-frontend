'use strict';

describe('Controller: UserfilesinterviewsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var UserfilesinterviewsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserfilesinterviewsCtrl = $controller('UserfilesinterviewsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
