'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms', {
    abstract : true,
    url : '/firms',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});