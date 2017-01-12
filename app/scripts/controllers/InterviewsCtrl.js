'use strict';

angular.module('qldarchApp').controller('InterviewsCtrl', function($scope, interviews, LayoutHelper, GraphHelper, Uris) {
  var DEFAULT_INTERVIEW_ROW_COUNT = 5;
  $scope.interviewRowDisplayCount = DEFAULT_INTERVIEW_ROW_COUNT;

  $scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), 6);
  $scope.Uris = Uris;

  $scope.addMoreInterviewRows = function() {
    $scope.interviewRowDisplayCount += 5;
  };
});