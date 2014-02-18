'use strict';

describe('Service: Entity', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Entity;
  beforeEach(inject(function (_Entity_) {
    Entity = _Entity_;
  }));

  it('should do something', function () {
    expect(!!Entity).toBe(true);
  });

});
