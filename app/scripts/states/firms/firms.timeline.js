'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms.timeline', {
    url : '/timeline?index',
    reloadOnSearch : false,
    templateUrl : 'views/firms/timeline.html',
    resolve : {
      firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {
        return AggArchObjs.loadFirms().then(function(data) {
          return $filter('filter')(data, function(firm) {
            if (angular.isDefined(firm.start) && angular.isDefined(firm.end)) {
              firm.start = new Date(firm.start);
              firm.end = new Date(firm.end);
              return firm;
            }
          });
        }).catch(function() {
          console.log('unable to load firms');
          return {};
        });
      } ]
    },
    controller : 'FirmsTimelineCtrl'
  });
});