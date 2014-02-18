'use strict';

describe('Service: Expression', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Expression;
  beforeEach(inject(function (_Expression_) {
    Expression = _Expression_;
  }));

  it('should do something', function () {
    expect(!!Expression).toBe(true);
  });

});
