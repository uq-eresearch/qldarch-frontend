'use strict';

describe('Service: Architectservice', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Architectservice;
  beforeEach(inject(function (_Architectservice_) {
    Architectservice = _Architectservice_;
  }));

  it('should do something', function () {
    expect(!!Architectservice).toBe(true);
  });

});
