'use strict';

describe('Service: Stopwords', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Stopwords;
  beforeEach(inject(function (_Stopwords_) {
    Stopwords = _Stopwords_;
  }));

  it('should do something', function () {
    expect(!!Stopwords).toBe(true);
  });

});
