'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('interviews', {
    url : '/interviews?index',
    templateUrl : 'views/interviews.html',
    resolve : {
      interviews : [ 'Interviews', function(Interviews) {
        return Interviews.getInterviews();
      } ],
    },
    controller : 'InterviewsCtrl'
  });
});