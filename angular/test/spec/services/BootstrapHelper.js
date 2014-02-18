'use strict';

describe('Service: Bootstraphelper', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Bootstraphelper;
  beforeEach(inject(function (_Bootstraphelper_) {
    Bootstraphelper = _Bootstraphelper_;
  }));

  it('should do something', function () {
    expect(!!Bootstraphelper).toBe(true);
  });

});
