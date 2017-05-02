'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('relationships', {
    abstract : true,
    url : '/relationships',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});