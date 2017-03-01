'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect', {
    abstract: true,
    url: '/architect?architectId',
    templateUrl: 'views/architect/layout.html',
    resolve: {
      architect: ['$stateParams', '$http', 'Uris', 'Relationshiplabels', function($stateParams, $http, Uris, Relationshiplabels) {
        return $http.get(Uris.WS_ROOT+ 'archobj/'+$stateParams.architectId).then(function(result) {
          angular.forEach(result.data.relationships, function (relationship) {
            if (Relationshiplabels.hasOwnProperty(relationship.relationship)) {
              relationship.relationship = Relationshiplabels[relationship.relationship];
            }
          });
          return result.data;
        });
      }],
      interviews: ['architect', '$http', 'Uris', function(architect, $http, Uris) {
        if (architect.interviews) {
          var interviews = [];
          angular.forEach(architect.interviews, function(interview) {
            $http.get(Uris.WS_ROOT+ 'archobj/'+interview).then(function(result) {
              interviews.push(result.data);
            });
          });
          return interviews;
        }
      }]
    },
    controller: ['$scope', 'architect', 'interviews', 'Uris', 'Entity', '$state', function($scope, architect, interviews, Uris, Entity, $state) {
      $scope.architect = architect;
      $scope.interviews = interviews;
      $scope.entity = architect;

      $scope.delete = function(architect) {
        var r = window.confirm('Delete architect ' + architect.name + '?');
        if (r === true) {
          Entity.delete(architect.uri).then(function() {
            $state.go('architects.queensland');
          });
        }
      };
    }
    ]
  });
});