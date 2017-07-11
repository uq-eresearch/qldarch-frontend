'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.interviews', {
    url : '/interviews',
    templateUrl : 'views/interviews.html',
    resolve : {
      intrvws : [ 'Interviews', function(Interviews) {
        return Interviews.getInterviews();
      } ],
      interviews : [ 'structure', '$filter', 'intrvws', function(structure, $filter, intrvws) {
        /* globals _:false */
        var sourceIntrvws = $filter('filter')(structure.relationships, function(relationship) {
          if (relationship.source === 'interview') {
            return relationship;
          }
        });
        angular.forEach(sourceIntrvws, function(s) {
          angular.forEach(intrvws, function(intrvw) {
            angular.forEach(intrvw.interviews, function(i) {
              if (s.interview === i) {
                if (angular.isDefined(intrvw.label)) {
                  s.interviewlabel = intrvw.label;
                }
                if (angular.isDefined(intrvw.media)) {
                  s.media = intrvw.media;
                }
              }
            });
          });
        });
        sourceIntrvws = $filter('orderBy')(sourceIntrvws, function(s) {
          return (s.interviewlabel || '');
        });
        return _.uniqBy(sourceIntrvws, 'interview');
      } ]
    },
    controller : 'InterviewsCtrl'
  });
});