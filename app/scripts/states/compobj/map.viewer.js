'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('map.viewer', {
    url : '/viewer',
    templateUrl : 'views/compobj/map.viewer.html',
    controller : 'MapViewerCtrl'
  });
});