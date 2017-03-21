'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect', {
    abstract: true,
    url: '/architect?architectId',
    templateUrl: 'views/architect/layout.html',
    resolve: {
      architect: ['$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        if (!$stateParams.architectId) {
          return {};
        } else {
          return ArchObj.loadWithRelationshipLabels($stateParams.architectId).then(function(data) {
            return data;
          }).catch(function() {
            console.log('unable to load architect ArchObj with relationship labels');
            return {};
          });
        }
      }],
      interviews: ['architect', 'ArchObj', function(architect, ArchObj) {
        if (architect.interviews) {
          var interviews = [];
          angular.forEach(architect.interviews, function(interview) {
            ArchObj.load(interview).then(function(data) {
              interviews.push(data);
            }).catch(function() {
              console.log('unable to load interview ArchObj');
              return {};
            });
          });
          return interviews;
        }
      }]
    },
    controller: ['$scope', 'architect', 'interviews', 'ArchObj', '$state', function($scope, architect, interviews, ArchObj, $state) {
      $scope.architect = architect;
      $scope.interviews = interviews;
      $scope.entity = architect;

      $scope.delete = function(architect) {
        var r = window.confirm('Delete architect ' + architect.label + '?');
        if (r === true) {
          ArchObj.delete(architect.id).then(function() {
            $state.go('architects.queensland');
          });
        }
      };
    }
    ]
  });
});