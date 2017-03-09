'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firms.timeline', {
    url : '/timeline?index',
    templateUrl : 'views/firms/timeline.html',
    resolve : {
      firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {
        return AggArchObjs.loadFirms().then(function(data) {
          return $filter('filter')(data, function(firm) {
            return firm.australian === true;
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
    controller : 'FirmsTimelineCtrl'
  });
});