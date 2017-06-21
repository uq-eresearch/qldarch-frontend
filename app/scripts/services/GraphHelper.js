'use strict';

angular.module('qldarchApp').service('GraphHelper', function() {
  var that = this;

  this.asArray = function(value) {
    if (!angular.isDefined(value)) {
      return [];
    }
    if (angular.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  };

  this.graphValues = function(graphs) {
    var results = [];
    angular.forEach(graphs, function(graph) {
      results.push(graph);
    });
    return results;
  };

  /**
   * Adds an encoded uri to a single graph
   * 
   * @param graph
   * @returns {*}
   */
  this.encodeUri = function(graph) {
    if (graph) {
      graph.encodedUri = btoa(graph.uri);
    }
    return graph;
  };

  /**
   * Adds an encoded uri to a series of graphs
   * 
   * @param graphs
   * @returns {*}
   */
  this.encodeUris = function(graphs) {
    angular.forEach(graphs, function(graph) {
      if (angular.isDefined(graph.uri)) {
        that.encodeUri(graph);
      }
    });
    return graphs;
  };
  this.decodeUriString = function(encodedUri) {
    return atob(encodedUri);
  };
  this.encodeUriString = function(uri) {
    return btoa(uri);
  };


  this.indexOfWithAttr = function(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
  };

  /**
   * Get out all the unique values assoc with a property
   * 
   * @param array
   * @param attrs
   * @returns {Array}
   */
  this.getAttributeValuesUnique = function(array, attrs) {
    var uniqueValues = [];

    // converts attributes to array, just makes things easier
    if (!angular.isArray(attrs)) {
      attrs = [attrs];
    }

    // go through all the tiems in the array
    angular.forEach(array, function(item) {
      // go through all the attributes
      angular.forEach(attrs, function(attr) {
        if (angular.isDefined(item[attr])) {

          var values = item[attr];

          // convert values to an array if its not
          if (!angular.isArray(values)) {
            values = [values];
          }
          angular.forEach(values, function(value) {
            if (uniqueValues.indexOf(value) === -1) {
              uniqueValues.push(value);
            }
          });
        }
      });
    });
    return uniqueValues;
  };

  /**
   * Updates original to match new array
   * 
   * @param original
   */
  this.updateArray = function(originalArray, newArray, comparisonAttr) {

    // Compare the new array to the old array
    for (var i = originalArray.length - 1; i >= 0; i--) {
      var originalItem = originalArray[i];
      var atIndex = -1;

      /* jshint loopfunc:true */
      angular.forEach(newArray, function(newItem, i2) {
        // Check if this old item is in new array
        if (newItem[comparisonAttr] === originalItem[comparisonAttr]) {
          atIndex = i2;
        }
      });
      if (atIndex !== -1) {
        // we found it in the new stuff, so remove it from the new
        // stuff
        newArray.splice(atIndex, 1);
        originalItem.new = true;
      } else {
        // we didnt find it
        // so remove it from the old one
        originalItem.new = false;
      }
    }
    // Append all the new ones we didnt have before
    angular.forEach(newArray, function(newItem) {

      originalArray.push(newItem);
    });
  };

});