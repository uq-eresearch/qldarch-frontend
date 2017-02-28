'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('architect.structures', {
        url : '/structures',
        templateUrl : 'views/architect/structures.html',
        resolve : {
          structures : [
              'architect',
              '$filter',
              '$http',
              'Uris',
              '$q',
              function(architect, $filter, $http, Uris, $q) {
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
                var tstructures = [];
                angular.forEach(filteredrelationships, function(structure) {
                  var promise = $http
                      .get(Uris.WS_ROOT + 'archobj/' + ((structure.subjectype === 'structure') ? structure.subject : structure.object)).then(
                          function(result) {
                            if (angular.isUndefined(structure.media)) {
                              structure.media = $filter('filter')(result.data.media, function(med) {
                                return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
                              }).id;
                            }
                            structure.typologies = result.data.typologies;
                            if (angular.isDefined(result.data.latitude)) {
                              structure.lat = result.data.latitude;
                              structure.lon = result.data.longitude;
                            }
                            tstructures.push(structure);
                            return result;
                          });
                  promises.push(promise);
                });
                return $q.all(promises).then(function() {
                  var unique = _.uniqBy(tstructures, 'structurelabel');
                  // console.log(unique);
                  return unique;
                });
              } ]
        },
        controller : 'ArchitectStructuresCtrl'
      });
    });