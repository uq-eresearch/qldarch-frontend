'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms.other', {
    url : '/other?index',
    templateUrl : 'views/firms/firms.html',
    resolve : {
      firms : [ '$http', '$filter', 'Uris', function($http, $filter, Uris) {
        return $http.get(Uris.WS_ROOT + 'firms').then(function(result) {
          return $filter('filter')(result.data, function(firm) {
            return firm.australian !== true && (firm.label && !(/\s/.test(firm.label.substring(0, 1))));
          });
        });
      } ],
      australian : function() {
        return false;
      }
    },
    controller : 'FirmsCtrl'
  });
});