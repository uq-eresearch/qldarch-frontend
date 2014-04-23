'use strict';

describe('Controller: UserFilesInterviewsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var UserFilesInterviewsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserFilesInterviewsCtrl = $controller('UserFilesInterviewsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
