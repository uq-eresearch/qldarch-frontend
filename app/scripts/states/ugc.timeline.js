'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.timeline', {
    url : '/timeline',
    views : {
      header : {
        templateUrl : 'views/ugc/timeline.header.html'
      },
      builder : {
        template : ''
      },
      viewer : {
        templateUrl : 'views/ugc/timeline.viewer.html',
        controller : 'TimelineViewerCtrl'
      }
    }
  });
});