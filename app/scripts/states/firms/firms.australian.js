'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms.australian', {
    url : '?index',
    reloadOnSearch : false,
    templateUrl : 'views/firms/firms.html',
    resolve : {
      firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {
        return AggArchObjs.loadFirms().then(function(data) {
          return $filter('filter')(data, function(firm) {
            return firm.australian === true && (firm.label && !(/\s/.test(firm.label.substring(0, 1))));
          });
        }).catch(function() {
          console.log('unable to load australian firms');
          return {};
        });
      } ],
      australian : function() {
        return true;
      }
    },
    controller : 'FirmsCtrl'
  });
});