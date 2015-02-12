'use strict';

/**
 * @ngdoc service
 * @name angularApp.interviewRepository
 * @description
 * # interviewRepository
 * Factory in the angularApp.
 */
angular.module('angularApp')
    .factory('interviewRepository', function (Expression, GraphHelper, Uris, Architect, $filter, Interview) {

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
            return getAll().then(function (interviews) {
                interviews = _.filter(interviews, function(interview) {
                     return interview.interviewees.length;
                });
                // Filter only the interviews with pictures
                // Looks better for the front page
                interviews = _.sortBy(interviews, function(interview) {
                    return !hasPicture(interview);
                });
                return interviews;
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
