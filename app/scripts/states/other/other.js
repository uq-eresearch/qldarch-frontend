'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other', {
    abstract : true,
    url : '/other?otherId',
    templateUrl : 'views/other/layout.html',
    resolve : {
      other : [ '$stateParams', '$http', 'Uris', 'Relationshiplabels', function($stateParams, $http, Uris, Relationshiplabels) {
        return $http.get(Uris.WS_ROOT + 'archobj/' + $stateParams.otherId).then(function(result) {
          angular.forEach(result.data.relationships, function(relationship) {
            if (Relationshiplabels.hasOwnProperty(relationship.relationship)) {
              relationship.relationship = Relationshiplabels[relationship.relationship];
            }
          });
          return result.data;
        });
      } ],
      interviews : [ 'other', '$http', 'Uris', function(other, $http, Uris) {
        if (other.interviews) {
          var interviews = [];
          angular.forEach(other.interviews, function(interview) {
            $http.get(Uris.WS_ROOT + 'archobj/' + interview).then(function(result) {
              interviews.push(result.data);
            });
          });
          return interviews;
        }
      } ]
    },
    controller : [ '$scope', 'other', 'interviews', function($scope, other, interviews) {
      $scope.other = other;
      $scope.interviews = interviews;
    } ]
  });
});