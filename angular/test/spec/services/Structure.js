'use strict';

describe('Service: Structure', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Structure;
  beforeEach(inject(function (_Structure_) {
    Structure = _Structure_;
  }));

  it('should do something', function () {
    expect(!!Structure).toBe(true);
  });

});
