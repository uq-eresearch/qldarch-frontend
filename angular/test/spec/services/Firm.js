'use strict';

describe('Service: Firm', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Firm;
  beforeEach(inject(function (_Firm_) {
    Firm = _Firm_;
  }));

  it('should do something', function () {
    expect(!!Firm).toBe(true);
  });

});
