'use strict';

describe('Service: Compoundobject', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Compoundobject;
  beforeEach(inject(function (_Compoundobject_) {
    Compoundobject = _Compoundobject_;
  }));

  it('should do something', function () {
    expect(!!Compoundobject).toBe(true);
  });

});
