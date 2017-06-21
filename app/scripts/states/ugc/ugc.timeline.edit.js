'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.timeline.edit', {
    url : '/edit',
    reloadOnSearch : false,
    views : {
      'builder@ugc' : {
        resolve : {
          entities : [ 'arfist', function(arfist) {
            return angular.copy(arfist);
          } ]
        },
        templateUrl : 'views/ugc/timeline.builder.html',
        controller : 'TimelineBuilderCtrl'
      }
    }
  });
});