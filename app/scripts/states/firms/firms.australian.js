'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms.australian', {
    url : '?index',
    reloadOnSearch : false,
    templateUrl : 'views/firms/firms.html',
    resolve : {
      firms : [ '$http', '$filter', 'Uris', function($http, $filter, Uris) {
        return $http.get(Uris.WS_ROOT + 'firms').then(function(result) {
          console.log(result.data);
          return $filter('filter')(result.data, function(firm) {
            return firm.australian === true;
          });
        });
      } ],
      australian : function() {
        return true;
      }
    },
    controller : 'FirmsCtrl'
  });
});