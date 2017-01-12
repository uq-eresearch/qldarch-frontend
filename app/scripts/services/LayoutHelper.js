'use strict';

angular.module('qldarchApp').factory('LayoutHelper', function() {

  // Public API here
  return {
    group : function(array, number) {
      var rows = [];
      angular.forEach(array, function(item, i) {
        if (i % number === 0) {
          rows.push([]);
        }
        rows[rows.length - 1].push(item);
      });
      return rows;
    }
  };
});