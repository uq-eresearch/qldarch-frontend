'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('interview', {
    url : '/interview/:interviewId?time',
    resolve : {
      interviews : [ 'Interviews', function(Interviews) {
        return Interviews.getInterviews();
      } ],
      interview : [ '$state', '$stateParams', 'ngProgress', 'interviews', 'ArchObj', function($state, $stateParams, ngProgress, interviews, ArchObj) {
        ngProgress.reset();
        return ArchObj.load($stateParams.interviewId).then(function(data) {
          var isArchitect;
          var intervieweeId;
          var archobjinterviewee = angular.copy(data.interviewee);
          for (var h = 0; h < archobjinterviewee.length; h++) {
            for (var i = 0; i < interviews.length; i++) {
              if (interviews[i].interviewee === archobjinterviewee[h].id) {
                isArchitect = interviews[i].architect;
                intervieweeId = interviews[i].interviewee;
              }
            }
          }
          if (isArchitect) {
            $state.go('architect.interview', {
              architectId : intervieweeId,
              interviewId : $stateParams.interviewId,
              time : $stateParams.time
            });
          } else {
            $state.go('other.interview', {
              otherId : intervieweeId,
              interviewId : $stateParams.interviewId,
              time : $stateParams.time
            });
          }
        });
      } ]
    }
  });
});