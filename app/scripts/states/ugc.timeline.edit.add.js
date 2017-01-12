'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.timeline.edit.add', {
    abstract : true,
    url : '/add',
    template : '<ui-view autoscroll="false"></ui-view>'
  });
});