'use strict';

describe('Service: interviewRepository', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var interviewRepository;
  beforeEach(inject(function (_interviewRepository_) {
    interviewRepository = _interviewRepository_;
  }));

  it('should do something', function () {
    expect(!!interviewRepository).toBe(true);
  });

});
