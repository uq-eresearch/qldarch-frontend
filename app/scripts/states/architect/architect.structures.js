'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.structures', {
    url : '/structures',
    templateUrl : 'views/architect/structures.html',
    resolve : {
      structures : [ 'architect', 'allstructures', '$filter', function(architect, allstructures, $filter) {
        /* globals _:false */
        var filteredrelationships = $filter('filter')(architect.relationships, function(relationship) {
          if (relationship.subjecttype === 'structure' || relationship.objecttype === 'structure') {
            if (relationship.subjecttype === 'structure') {
              relationship.structurelabel = relationship.subjectlabel;
            }
            if (relationship.objecttype === 'structure') {
              relationship.structurelabel = relationship.objectlabel;
            }
            return relationship;
          }
        });
        angular.forEach(filteredrelationships, function(structure) {
          angular.forEach(allstructures, function(s) {
            if (structure.subjecttype === 'structure') {
              structure.structureId = structure.subject;
            } else {
              structure.structureId = structure.object;
            }
            if (structure.structureId === s.id) {
              if (angular.isDefined(s.media)) {
                structure.media = s.media;
              }
              if (angular.isDefined(s.lat) && angular.isDefined(s.lng)) {
                structure.lat = s.lat;
                structure.lng = s.lng;
              }
            }
          });
        });
        filteredrelationships = $filter('orderBy')(filteredrelationships, function(structure) {
          return (structure.structurelabel || '');
        });
        return _.uniqBy(filteredrelationships, 'structureId');
      } ]
    },
    controller : 'ArchitectStructuresCtrl'
  });
});