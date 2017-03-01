'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.timeline', {
    url : '/timeline',
    templateUrl : 'views/timeline.html',
    controller : 'TimelineCtrl',
    resolve : {
      data : [ 'firm', function(firm) {
        return angular.copy(firm);
      } ]
    }
  });
});