'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('upload', {
    abstract : true,
    url : '/upload?uri&name&type',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});