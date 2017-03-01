'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.timeline', {
    url : '/timeline',
    templateUrl : 'views/timeline.html',
    resolve : {
      data : [ 'structure', function(structure) {
        return angular.copy(structure);
      } ]
    },
    controller : 'TimelineCtrl'
  });
});