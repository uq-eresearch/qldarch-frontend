'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architects.queensland', {
    url : '?index',
    templateUrl : 'views/architects/architects.html',
    controller : 'ArchitectsCtrl',
    resolve : {
      architects : [ 'Architect', '$filter', 'Uris', 'GraphHelper', function(Architect, $filter, Uris, GraphHelper) {
        return Architect.loadAll(false).then(function(architects) {
          architects = GraphHelper.graphValues(architects);
          return $filter('filter')(architects, function(architect) {
            return architect[Uris.QA_PRACTICED_IN_QUEENSLAND] === true;
          });
        });
      } ]
    }
  });
});