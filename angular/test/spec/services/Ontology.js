'use strict';

describe('Service: Ontology', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var Ontology;
  beforeEach(inject(function (_Ontology_) {
    Ontology = _Ontology_;
  }));

  it('should do something', function () {
    expect(!!Ontology).toBe(true);
  });

});
