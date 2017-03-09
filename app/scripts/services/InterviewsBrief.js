'use strict';

/**
 * @ngdoc service
 * @name qldarchApp.InterviewsBrief
 * @description # InterviewsBrief Factory in the qldarchApp.
 */
angular.module('qldarchApp').factory('InterviewsBrief', function(AggArchObjs) {

  /* globals _:false */
  function getInterviewsForCarousel() {
    return AggArchObjs.loadInterviewsBrief().then(function(data) {
      var interviews = data;
      return _.shuffle(_.uniqBy(interviews, function(interview) {
        return interview.interviewee;
      }).filter(function(interview) {
        // only show the interviews that have an interviewee picture on the
        // home page carousel
        return typeof interview.media !== 'undefined';
      }));
    }).catch(function() {
      console.log('unable to load interviews brief');
      return {};
    });
  }

  var InterviewsBrief = {
    getInterviewsForCarousel : getInterviewsForCarousel
  };

  return InterviewsBrief;
});