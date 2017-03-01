'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structures', {
    abstract : true,
    url : '/projects',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});