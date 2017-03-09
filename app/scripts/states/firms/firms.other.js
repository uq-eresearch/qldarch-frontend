'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms.other', {
    url : '/other?index',
    reloadOnSearch : false,
    templateUrl : 'views/firms/firms.html',
    resolve : {
      firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {        
        return AggArchObjs.loadFirms().then(function(data) {
          return $filter('filter')(data, function(firm) {
            return firm.australian === false && (firm.label && !(/\s/.test(firm.label.substring(0, 1))));
          });
        }).catch(function() {
          console.log('unable to load other firms');
          return {};
        });
      } ],
      australian : function() {
        return false;
      }
    },
    controller : 'FirmsCtrl'
  });
});