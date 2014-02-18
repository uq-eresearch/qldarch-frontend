'use strict';

describe('Service: Interview', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Interview;
  beforeEach(inject(function (_Interview_) {
    Interview = _Interview_;
  }));

  it('should do something', function () {
    expect(!!Interview).toBe(true);
  });

});
