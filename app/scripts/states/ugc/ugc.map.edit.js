'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc.map.edit', {
    url : '/edit',
    reloadOnSearch : false,
    views : {
      'builder@ugc' : {
        resolve : {
          entities : [ 'arfist', function(arfist) {
            return angular.copy(arfist);
          } ]
        },
        templateUrl : 'views/ugc/map.builder.html',
        controller : 'MapBuilderCtrl'
      }
    }
  });
});