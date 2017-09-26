'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.summary', {
    url : '/summary',
    templateUrl : 'views/firm/summary.html',
    resolve : {
      architects : [ 'AggArchObjs', 'GraphHelper', '$filter', function(AggArchObjs, GraphHelper, $filter) {
        return AggArchObjs.loadArchitects().then(function(data) {
          return $filter('filter')(data, function(architect) {
            return architect.label && !(/\s/.test(architect.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load architects');
          return {};
        });
      } ]
    },
    controller : 'FirmCtrl'
  });
});