'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('interview', {
    url : '/interview/:interviewId?time',
    resolve : {
      interview : [ 'Interview', '$state', '$stateParams', 'ngProgress', function(Interview, $state, $stateParams, ngProgress) {
        var interviewUri = atob($stateParams.interviewId);
        ngProgress.reset();
        return Interview.load(interviewUri).then(function(interview) {
          var interviewee = interview.interviewees[0];
          if (interviewee.$state === 'other') {
            $state.go(interviewee.$state + '.interview', {
              otherId : interviewee.encodedUri,
              interviewId : $stateParams.interviewId,
              time : $stateParams.time
            });
          } else {
            $state.go(interviewee.$state + '.interview', {
              architectId : interviewee.encodedUri,
              interviewId : $stateParams.interviewId,
              time : $stateParams.time
            });
          }
        });
      } ]
    }
  });
});