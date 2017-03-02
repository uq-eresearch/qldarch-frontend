'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architects.other', {
    url : '/other?index',
    templateUrl : 'views/architects/architects.html',
    controller : 'ArchitectsCtrl',
    resolve : {
      architects : [ '$http', '$filter', 'Uris', 'GraphHelper', function($http, $filter, Uris, GraphHelper) {
        return $http.get(Uris.WS_ROOT + 'architects').then(function(result) {
          var architects = GraphHelper.graphValues(result.data);
          return $filter('filter')(architects, function(architect) {
            return architect.practicedinqueensland === false && (architect.label && !(/\s/.test(architect.label.substring(0, 1))));
          });
        });
      } ],
      practicedinqueensland : function() {
        return false;
      }
    }
  });
});