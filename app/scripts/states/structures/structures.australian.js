'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structures.australian', {
    url : '?index',
    templateUrl : 'views/structures.html',
    controller : 'StructuresCtrl',
    resolve : {
      structures : [ '$http', '$filter', 'Uris', function($http, $filter, Uris) {
        return $http.get(Uris.WS_ROOT + 'projects').then(function(result) {
          // console.log(result.data);
          return $filter('filter')(result.data, function(structure) {
            if (structure.australian === true) {
              if (structure.lng) {
                structure.lon = structure.lng;
              }
              return structure;
            }
          });
        });
      } ]
    }
  });
});