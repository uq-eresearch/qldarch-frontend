'use strict';

describe('Controller: UploadInterviewsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var UploadInterviewsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadInterviewsCtrl = $controller('UploadInterviewsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
