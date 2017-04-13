'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('realtionships', {
    abstract : true,
    url : '/relationships',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});