'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.timeline.edit', {
    url : '/edit',
    controller : 'TimelineBuilderCtrl',
    reloadOnSearch : false,
    views : {
      'builder@ugc' : {
        templateUrl : 'views/ugc/timeline.builder.html',
        controller : 'TimelineBuilderCtrl'
      }
    }
  });
});