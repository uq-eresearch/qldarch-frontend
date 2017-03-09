'use strict';

angular.module('qldarchApp').factory('Interviews', function(AggArchObjs, GraphHelper, $filter) {    
  function getInterviews() {
    return AggArchObjs.loadInterviews().then(function(data) {
      var interviews = data;
      interviews = GraphHelper.graphValues(interviews);
      interviews = $filter('orderBy')(interviews, function(interview) {
        return interview.label;
      });
      interviews = $filter('filter')(interviews, function(interview) {
        return interview.architect;
      });
      return interviews;
    }).catch(function() {
      console.log('unable to load interviews');
      return {};
    });
  }

  var Interviews = {
    getInterviews : getInterviews
  };

  return Interviews;
});