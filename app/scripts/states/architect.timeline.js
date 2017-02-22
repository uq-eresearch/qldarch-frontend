'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.timeline', {
    url : '/timeline',
    templateUrl : 'views/timeline.html',
    controller : 'TimelineCtrl',
    resolve : {
      data : [ 'architect', function(architect) {
        return angular.copy(architect);
      } ]
    }
  });
});