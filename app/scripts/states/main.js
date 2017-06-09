'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('main', {
    url : '/',
    controller : 'MainCtrl',
    resolve : {
      // Load X number of interviews
      interviews : [ 'InterviewsBrief', function(InterviewsBrief) {
        return InterviewsBrief.getInterviewsForCarousel();
      } ],
      compoundObjects : [ 'CompObj', '$filter', function(CompObj, $filter) {
        return CompObj.loadAll().then(function(compoundObjects) {
          compoundObjects = $filter('orderBy')(compoundObjects, function(compoundObject) {
            return compoundObject.modified;
          });
          compoundObjects = $filter('filter')(compoundObjects, function(compoundObject) {
            return angular.isDefined(compoundObject.type);
          });
          return compoundObjects;
        });
      } ]
    },
    templateUrl : 'views/main.html'
  });
});