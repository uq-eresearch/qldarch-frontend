'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other', {
    abstract : true,
    url : '/other?otherId',
    templateUrl : 'views/other/layout.html',
    resolve : {
      other : [ 'Entity', '$stateParams', 'GraphHelper', function(Entity, $stateParams, GraphHelper) {
        console.log('loading other');
        if (!$stateParams.otherId) {
          console.log('no other id');
          return {};
        }
        console.log('getting uri');
        var uri = GraphHelper.decodeUriString($stateParams.otherId);
        console.log('got to here');
        return Entity.load(uri, false);
      } ],
      interviews : [ 'Interview', '$stateParams', 'GraphHelper', function(Interview, $stateParams, GraphHelper) {
        if (!$stateParams.otherId) {
          return null;
        }
        var uri = GraphHelper.decodeUriString($stateParams.otherId);
        return Interview.findByIntervieweeUri(uri).then(function(interviews) {
          console.log('got interviews for', uri, interviews);
          return interviews;
        });
      } ]
    },
    controller : [ '$scope', 'other', 'interviews', function($scope, other, interviews) {
      $scope.other = other;
      $scope.interviews = interviews;
    } ]
  });
});