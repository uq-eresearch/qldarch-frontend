'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('admin', {
    abstract : true,
    url : '/admin',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});