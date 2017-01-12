'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('main', {
    url : '/',
    controller : 'MainCtrl',
    resolve : {
      // Load X number of interviews
      interviews : [ 'InterviewRepository', 'Expression', 'GraphHelper', 'Uris', 'Architect', '$filter', 'Interview', function(InterviewRepository) {
        return InterviewRepository.getInterviewsForCarousel();

      } ],
      compoundObjects : [ 'CompoundObject', '$filter', function(CompoundObject, $filter) {
        return CompoundObject.loadAll().then(function(compoundObjects) {
          compoundObjects = $filter('orderBy')(compoundObjects, '-jsonData.modified');
          compoundObjects = $filter('filter')(compoundObjects, function(compoundObject) {
            return angular.isDefined(compoundObject.jsonData.type);
          });
          console.log('compoundObjects', compoundObjects);
          return compoundObjects;
        });
      } ]
    },
    templateUrl : 'views/main.html'
  });
});