'use strict';

angular.module('qldarchApp').controller('InterviewsCtrl',
    function($scope, interviews, LayoutHelper, $stateParams, GraphHelper, Uris, $filter, $state) {
      var DEFAULT_INTERVIEW_ROW_COUNT = 5;
      $scope.interviewRowDisplayCount = DEFAULT_INTERVIEW_ROW_COUNT;
      $scope.$stateParams = $stateParams;
      $scope.indexes = {
        'A' : false,
        'B' : false,
        'C' : false,
        'D' : false,
        'E' : false,
        'F' : false,
        'G' : false,
        'H' : false,
        'I' : false,
        'J' : false,
        'K' : false,
        'L' : false,
        'M' : false,
        'N' : false,
        'O' : false,
        'P' : false,
        'Q' : false,
        'R' : false,
        'S' : false,
        'T' : false,
        'U' : false,
        'V' : false,
        'W' : false,
        'X' : false,
        'Y' : false,
        'Z' : false
      };

      function isLetter(char) {
        return char.match(/[a-z]/i);
      }

      interviews = $filter('filter')(interviews, function(interview) {
        if (angular.isDefined(interview.label)) {
          $scope.indexes[interview.label.substring(0, 1).toUpperCase()] = true;
          if ($stateParams.index && $stateParams.index.length === 1) {
            if (isLetter($stateParams.index) && interview.label.substring(0, 1).toUpperCase() === $stateParams.index) {
              return true;
            }
            return false;
          }
          return true;
        } else if (angular.isDefined(interview.interviewlabel)) {
          return true;
        }
      });

      interviews = $filter('orderBy')(interviews, function(interview) {
        return (interview.label || interview.interviewlabel || '');
      });

      $scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), 6);
      $scope.Uris = Uris;

      $scope.goToIndex = function(index) {
        $state.go('interviews', {
          index : index
        });
      };

      $scope.addMoreInterviewRows = function() {
        $scope.interviewRowDisplayCount += 5;
      };
    });