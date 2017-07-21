'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other', {
    abstract : true,
    url : '/other?otherId',
    templateUrl : 'views/other/layout.html',
    resolve : {
      other : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        if (!$stateParams.otherId) {
          return {};
        } else {
          return ArchObj.loadWithRelationshipLabels($stateParams.otherId).then(function(data) {
            return data;
          }).catch(function() {
            console.log('unable to load other ArchObj with relationship labels');
            return {};
          });
        }
      } ],
      interviews : [ 'other', 'ArchObj', function(other, ArchObj) {
        if (other.interviews) {
          var interviews = [];
          angular.forEach(other.interviews, function(interview) {
            ArchObj.load(interview).then(function(data) {
              interviews.push(data);
            }).catch(function() {
              console.log('unable to load interview ArchObj');
              return {};
            });
          });
          return interviews;
        }
      } ]
    },
    controller : [ '$scope', 'other', 'interviews', 'ArchObj', '$state', function($scope, other, interviews, ArchObj, $state) {
      $scope.other = other;
      $scope.interviews = interviews;

      $scope.delete = function(other) {
        var r = window.confirm('Delete other ' + other.label + '?');
        if (r === true) {
          ArchObj.delete(other.id).then(function() {
            $state.go('others');
          });
        }
      };
    } ]
  });
});