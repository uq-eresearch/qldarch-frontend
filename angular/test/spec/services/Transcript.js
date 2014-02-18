'use strict';

describe('Service: Transcript', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Transcript;
  beforeEach(inject(function (_Transcript_) {
    Transcript = _Transcript_;
  }));

  it('should do something', function () {
    expect(!!Transcript).toBe(true);
  });

});
