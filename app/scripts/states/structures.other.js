'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structures.other', {
    url : '/other?index',
    templateUrl : 'views/structures.html',
    controller : 'StructuresCtrl',
    resolve : {
      structures : [ 'Structure', '$filter', 'GraphHelper', 'Uris', function(Structure, $filter, GraphHelper, Uris) {
        return Structure.loadAll(false).then(function(structures) {
          structures = GraphHelper.graphValues(structures);
          return $filter('filter')(structures, function(structure) {
            return structure[Uris.QA_AUSTRALIAN] !== true;
          });
        });
      } ]
    }
  });
});