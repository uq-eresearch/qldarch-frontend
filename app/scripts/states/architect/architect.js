'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect', {
    abstract : true,
    url : '/architect?architectId',
    templateUrl : 'views/architect/layout.html',
    resolve : {
      architect : [ '$stateParams', 'ArchObj', '$filter', function($stateParams, ArchObj, $filter) {
        if (!$stateParams.architectId) {
          return {};
        } else {
          return ArchObj.loadWithRelationshipLabels($stateParams.architectId).then(function(data) {
            data.media = $filter('orderBy')(data.media, function(media) {
              return (media.preferred || '');
            }, true);
            return data;
          }).catch(function() {
            console.log('unable to load architect ArchObj with relationship labels');
            return {};
          });
        }
      } ],
      interviews : [ 'architect', 'ArchObj', function(architect, ArchObj) {
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
      } ],
      firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {
        return AggArchObjs.loadFirms().then(function(data) {
          return $filter('filter')(data, function(firm) {
            return firm.label && !(/\s/.test(firm.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load all firms');
          return {};
        });
      } ],
      allstructures : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadProjects().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load all projects');
          return {};
        });
      } ]
    },
    controller : [ '$scope', 'architect', 'interviews', 'ArchObj', '$state', function($scope, architect, interviews, ArchObj, $state) {
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
    } ]
  });
});