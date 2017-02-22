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
              function(architect, $filter, $http, Uris) {
                /* globals _:false */
                var typestructure = $filter('filter')(
                    architect.relationships,
                    function(relationship) {
                      if (relationship.subjectype === 'structure' || relationship.objecttype === 'structure') {
                        if (relationship.subjectype === 'structure') {
                          relationship.structurelabel = relationship.subjectlabel;
                        }
                        if (relationship.objecttype === 'structure') {
                          relationship.structurelabel = relationship.objectlabel;
                        }
                        return $http.get(
                            Uris.WS_ROOT + 'archobj/' + ((relationship.subjectype === 'structure') ? relationship.subject : relationship.object))
                            .then(function(result) {
                              if (angular.isUndefined(relationship.media)) {
                                relationship.media = $filter('filter')(result.data.media, function(med) {
                                  return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
                                }).id;
                              }
                              relationship.typologies = result.data.typologies;
                              if (angular.isDefined(result.data.latitude)) {
                                relationship.lat = result.data.latitude;
                                relationship.lon = result.data.longitude;
                              }
                              return relationship;
                            });
                      }
                    });
                return _.uniqBy(typestructure, 'structurelabel');
              } ]
        },
        controller : 'ArchitectStructuresCtrl'
      });
    });