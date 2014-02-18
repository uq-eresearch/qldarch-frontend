'use strict';

describe('Service: Annotation', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Annotation;
  beforeEach(inject(function (_Annotation_) {
    Annotation = _Annotation_;
  }));

  it('should do something', function () {
    expect(!!Annotation).toBe(true);
  });

});
