'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('firm.structures', {
        url : '/projects',
        templateUrl : 'views/firm/structures.html',
        resolve : {
          structures : [
              'firm',
              '$filter',
              '$http',
              'Uris',
              function(firm, $filter, $http, Uris) {
                /* globals _:false */
                var typestructure = $filter('filter')(
                    firm.relationships,
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
                              return relationship;
                            });
                      }
                    });
                return _.uniqBy(typestructure, 'structurelabel');
              } ]
        },
        controller : [ '$scope', 'firm', 'structures', 'LayoutHelper', function($scope, firm, structures, LayoutHelper) {
          console.log(structures);
          $scope.firm = firm;
          $scope.structureRows = LayoutHelper.group(structures, 6);
        } ]
      });
    });