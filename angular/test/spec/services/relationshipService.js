'use strict';

describe('Service: Relationshipservice', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Relationshipservice;
  beforeEach(inject(function (_Relationshipservice_) {
    Relationshipservice = _Relationshipservice_;
  }));

  it('should do something', function () {
    expect(!!Relationshipservice).toBe(true);
  });

});
