'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('architect.structures', {
        url : '/structures',
        templateUrl : 'views/architect/structures.html',
        resolve : {
          structures : [ 'architect', '$filter', '$q', 'ArchObj', function(architect, $filter, $q, ArchObj) {
            /* globals _:false */
            var filteredrelationships = $filter('filter')(architect.relationships, function(relationship) {
              if (relationship.subjectype === 'structure' || relationship.objecttype === 'structure') {
                if (relationship.subjectype === 'structure') {
                  relationship.structurelabel = relationship.subjectlabel;
                }
                if (relationship.objecttype === 'structure') {
                  relationship.structurelabel = relationship.objectlabel;
                }
                return relationship;
              }
            });
            var promises = [];
            angular.forEach(filteredrelationships, function(structure) {            
              var promise = ArchObj.load(((structure.subjectype === 'structure') ? structure.subject : structure.object)).then(function(data) {
                if (angular.isUndefined(structure.media)) {
                  structure.media = $filter('filter')(data.media, function(med) {
                    return (med.preferred || (med.type === 'Photograph' || med.type === 'Portrait' || med.type === 'Image'));
                  }).id;
                }
                structure.typologies = data.typologies;
                if (angular.isDefined(data.latitude) && angular.isDefined(data.longitude)) {
                  structure.lat = data.latitude;
                  structure.lon = data.longitude;
                }
                return structure;
              }).catch(function() {
                console.log('unable to load structure ArchObj');
                return {};
              });
              promises.push(promise);
            });
            return $q.all(promises).then(function(data) {
              return _.uniqBy(data, 'structurelabel');
            });
          } ]
        },
        controller : 'ArchitectStructuresCtrl'
      });
    });