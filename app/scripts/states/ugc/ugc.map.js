'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.map', {
    url : '/map',
    views : {
      header : {
        templateUrl : 'views/ugc/map.header.html'
      },
      builder : {
        template : ''
      },
      viewer : {
        templateUrl : 'views/ugc/map.viewer.html',
        controller : 'MapViewerCtrl'
      }
    }
  });
});