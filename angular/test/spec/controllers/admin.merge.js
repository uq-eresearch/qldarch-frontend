'use strict';

describe('Controller: AdminMergeCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var AdminMergeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminMergeCtrl = $controller('AdminMergeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
