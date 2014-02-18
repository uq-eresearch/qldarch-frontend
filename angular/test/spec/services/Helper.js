'use strict';

describe('Service: Helper', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Helper;
  beforeEach(inject(function (_Helper_) {
    Helper = _Helper_;
  }));

  it('should do something', function () {
    expect(!!Helper).toBe(true);
  });

});
