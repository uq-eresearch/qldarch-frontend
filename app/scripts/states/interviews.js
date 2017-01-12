'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('interviews', {
        url : '/interviews',
        templateUrl : 'views/interviews.html',
        resolve : {
          // @todo: change this for building
          interviews : [
              'Expression',
              'GraphHelper',
              'Uris',
              'Architect',
              '$filter',
              'Interview',
              function(Expression, GraphHelper, Uris, Architect, $filter, Interview) {
                return Interview.loadAll().then(
                    function(interviews) {
                      interviews = GraphHelper.graphValues(interviews);
                      interviews = $filter('filter')(interviews, function(interview) {
                        return interview.interviewees[0];
                      });

                      interviews = $filter('orderBy')(interviews, function(interview) {
                        return interview.interviewees[0].encodedUri;
                      });

                      for (var i = interviews.length - 1; i >= 1; i--) {
                        if (interviews[i].interviewees[0] === interviews[i - 1].interviewees[0]) {
                          interviews.splice(i, 1);
                        }
                      }

                      console.log('interview count', interviews);
                      // Filter only the interviews with pictures
                      // Looks better for the front page
                      var interviewsWithPictures = $filter('orderBy')
                          (
                              interviews,
                              function(interview) {
                                if (angular.isDefined(interview.interviewees) && interview.interviewees.length &&
                                    angular.isDefined(interview.interviewees[0].picture) &&
                                    interview.interviewees[0].picture.file.indexOf('icon') === -1) {
                                  return 0;
                                } else {
                                  return 1;
                                }
                              });

                      return interviewsWithPictures;
                    });
              } ],
        },
        controller : 'InterviewsCtrl'
      });
    });