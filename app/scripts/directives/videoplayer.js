'use strict';

angular.module('qldarchApp').directive('videoplayer', function() {
  return {
    template : '<div></div>',
    restrict : 'E',
    link : function postLink(scope, element) {
      element.text('this is the videoplayer directive');
    }
  };
});