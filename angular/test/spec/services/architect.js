'use strict';

describe('Service: Architect', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Architect;
  beforeEach(inject(function (_Architect_) {
    Architect = _Architect_;
  }));

  it('should do something', function () {
    expect(!!Architect).toBe(true);
  });

});
