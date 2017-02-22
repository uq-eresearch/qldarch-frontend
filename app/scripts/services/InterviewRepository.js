'use strict';

/**
 * @ngdoc service
 * @name qldarchApp.InterviewRepository
 * @description # InterviewRepository Factory in the qldarchApp.
 */
angular.module('qldarchApp').factory('InterviewRepository', function(Uris, $filter, $http) {

  /* globals _:false */
  function getInterviewsForCarousel() {
    return $http.get(Uris.WS_ROOT + 'interviews/brief').then(function(result) {
      var interviews = result.data;
      return _.shuffle(_.uniqBy(interviews, function(interview) {
        return interview.interviewee;
      }).filter(function(interview) {
        // only show the interviews that have an interviewee picture on the
        // home page carousel
        return typeof interview.media !== 'undefined';
      }));
    });
  }

  var InterviewRepository = {
    getInterviewsForCarousel : getInterviewsForCarousel
  };

  return InterviewRepository;
});