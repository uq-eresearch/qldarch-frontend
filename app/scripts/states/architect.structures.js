'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.structures', {
    url : '/structures',
    templateUrl : 'views/architect/structures.html',
    resolve : {
      structures : [ '$stateParams', 'GraphHelper', 'Uris', 'Structure', 'Relationship', function($stateParams, GraphHelper, Uris, Structure) {

        var architectUri = GraphHelper.decodeUriString($stateParams.architectId);

        // Get designedBy, workedOn and 'associatedArchitect'
        return Structure.findByAssociatedArchitectUri(architectUri);
      } ]
    },
    controller : 'ArchitectStructuresCtrl'
  });
});