'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architects.queensland', {
    url : '?index',
    templateUrl : 'views/architects/architects.html',
    controller : 'ArchitectsCtrl',
    resolve : {
      architects : [ '$http', '$filter', 'Uris', function($http, $filter, Uris) {
        return $http.get(Uris.WS_ROOT + 'architects').then(function(result) {
          return $filter('filter')(result.data, function(architect) {
            return architect.practicedinqueensland === true;
          });
        });
      } ],
      practicedinqueensland : function() {
        return true;
      }
    }
  });
});