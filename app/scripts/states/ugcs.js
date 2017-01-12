'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugcs', {
    abstract : true,
    url : '/ugcs',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});