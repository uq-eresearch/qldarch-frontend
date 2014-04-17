'use strict';

describe('Controller: UserFilesDocumentsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var UserFilesDocumentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserFilesDocumentsCtrl = $controller('UserFilesDocumentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
