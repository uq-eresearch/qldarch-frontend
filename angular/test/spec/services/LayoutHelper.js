'use strict';

describe('Service: Layouthelper', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Layouthelper;
  beforeEach(inject(function (_Layouthelper_) {
    Layouthelper = _Layouthelper_;
  }));

  it('should do something', function () {
    expect(!!Layouthelper).toBe(true);
  });

});
