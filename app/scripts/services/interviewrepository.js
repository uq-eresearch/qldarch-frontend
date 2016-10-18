'use strict';

/**
 * @ngdoc service
 * @name angularApp.interviewRepository
 * @description
 * # interviewRepository
 * Factory in the angularApp.
 */
angular.module('angularApp')
    .factory('interviewRepository', function (Expression, GraphHelper, Uris, Architect, $filter, Interview, $http) {

        var interviewRepository = {
            getInterviewsForCarousel: getInterviewsForCarousel
        };
        return interviewRepository;
        ///

        function getAll() {
            return Interview.loadAll().then(function(interviews) {
                return _.values(interviews);
            });
        }

        function getInterviewsForCarousel() {
          return $http.get(Uris.WS_ROOT + 'interviews').then(function(result) {
            var interviews = result.data;
            interviews.forEach(function(interview) {
              interview.encodedUri = btoa('http://qldarch.net/interview/' + interview.id);
            });
            return _.shuffle(_.uniqBy(interviews, function(interview) {
              return interview.interviewee;
            }).filter(function(interview) {
              // only show the interviews that have an interviewee picture on the home page carousel
              return typeof interview.media !== 'undefined';
            }));
          });
        }

        function hasInterviewees(interview) {
            return angular.isDefined(interview.interviewees) && interview.interviewees.length;
        }

        function hasIntervieweePicture(interview) {
            var hasIntervieweePicture = false;
            _.each(interview.interviewees, function(interviewee) {
                hasIntervieweePicture = hasIntervieweePicture ||
                (interviewee && angular.isDefined(interviewee.picture) && interviewee.picture.file.indexOf('icon') === -1);
            });
            return hasIntervieweePicture;
        }

        function hasPicture(interview) {
            return hasInterviewees(interview) && hasIntervieweePicture(interview);
        }
    });
