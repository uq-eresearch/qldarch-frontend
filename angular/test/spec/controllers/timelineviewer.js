'use strict';

describe('Controller: TimelineviewerCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var TimelineviewerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimelineviewerCtrl = $controller('TimelineviewerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
