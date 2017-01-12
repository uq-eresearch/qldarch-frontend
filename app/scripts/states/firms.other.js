'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms.other', {
    url : '/other',
    templateUrl : 'views/firms.html',
    resolve : {
      firms : [ 'Firm', '$filter', 'GraphHelper', 'Uris', function(Firm, $filter, GraphHelper, Uris) {
        return Firm.loadAll(false).then(function(firms) {
          firms = GraphHelper.graphValues(firms);
          return $filter('filter')(firms, function(firm) {
            return firm[Uris.QA_AUSTRALIAN] !== true;
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