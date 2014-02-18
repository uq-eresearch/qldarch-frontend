'use strict';

describe('Service: Graphhelper', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Graphhelper;
  beforeEach(inject(function (_Graphhelper_) {
    Graphhelper = _Graphhelper_;
  }));

  it('should do something', function () {
    expect(!!Graphhelper).toBe(true);
  });

});
