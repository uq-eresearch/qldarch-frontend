'use strict';

describe('Service: Uris', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Uris;
  beforeEach(inject(function (_Uris_) {
    Uris = _Uris_;
  }));

  it('should do something', function () {
    expect(!!Uris).toBe(true);
  });

});
