'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structures.australian', {
    url : '?index',
    templateUrl : 'views/structures.html',
    controller : 'StructuresCtrl',
    resolve : {
      structures : [ 'Structure', '$filter', 'GraphHelper', 'Uris', function(Structure, $filter, GraphHelper, Uris) {
        return Structure.loadAll(false).then(function(structures) {
          structures = GraphHelper.graphValues(structures);
          console.log('got structures', structures);
          return $filter('filter')(structures, function(structure) {
            return structure[Uris.QA_AUSTRALIAN] === true;
          });
        });
      } ]
    }
  });
});