'use strict';

angular.module('qldarchApp').factory('Interviews', function($http, GraphHelper, Uris, $filter) {
  return $http.get(Uris.WS_ROOT + 'interviews').then(function(result) {
    var interviews = result.data;
    interviews = GraphHelper.graphValues(interviews);
    interviews = $filter('orderBy')(interviews, function(interview) {
      return interview.label;
    });
    interviews = $filter('filter')(interviews, function(interview) {
      return interview.architect;
    });
    return interviews;
  });
});