'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user', {
    abstract : true,
    url : '/user',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});