'use strict';

describe('Filter: slice', function () {

  // load the filter's module
  beforeEach(module('angularApp'));

  // initialize a new instance of the filter before each test
  var slice;
  beforeEach(inject(function ($filter) {
    slice = $filter('slice');
  }));

  it('should return the input prefixed with "slice filter:"', function () {
    var text = 'angularjs';
    expect(slice(text)).toBe('slice filter: ' + text);
  });

});
