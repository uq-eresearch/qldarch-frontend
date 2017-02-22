'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('interview', {
        url : '/interview/:interviewId?time',
        resolve : {
          interviews : [ 'Interviews', function(Interviews) {
            return Interviews;
          } ],
          interview : [ '$state', '$http', '$stateParams', 'ngProgress', 'Uris', 'interviews',
              function($state, $http, $stateParams, ngProgress, Uris, interviews) {
                ngProgress.reset();
                return $http.get(Uris.WS_ROOT + 'archobj/' + $stateParams.interviewId).then(function(result) {
                  var isArchitect;
                  var intervieweeId;
                  var archobjinterviewee = angular.copy(result.data.interviewee);
                  for (var h = 0; h < archobjinterviewee.length; h++) {
                    for (var i = 0; i < interviews.length; i++) {
                      if (interviews[i].interviewee === archobjinterviewee[h].id) {
                        isArchitect = interviews[i].architect;
                        intervieweeId = interviews[i].interviewee;
                      }
                    }
                  }
                  console.log(isArchitect);
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