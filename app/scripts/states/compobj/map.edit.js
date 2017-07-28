'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('map.edit', {
    url : '/edit',
    reloadOnSearch : false,
    resolve : {
      entities : [ 'arfist', function(arfist) {
        return angular.copy(arfist);
      } ]
    },
    templateUrl : 'views/compobj/map.builder.html',
    controller : 'MapBuilderCtrl'
  });
});