'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('structure.summary', {
        url : '/summary',
        templateUrl : 'views/structure/summary.html',
        resolve : {
          designers : [ '$stateParams', 'GraphHelper', 'Uris', 'Entity', 'Relationship', '$filter',
              function($stateParams, GraphHelper, Uris, Entity, Relationship, $filter) {
                var designers = {
                  architects : [],
                  firms : []
                };

                if (!$stateParams.structureId) {
                  return designers;
                }

                var structureUri = GraphHelper.decodeUriString($stateParams.structureId);

                return Relationship.findBySubjectPredicateObject({
                  predicate : 'qldarch:designedBy',
                  subject : structureUri
                }).then(function(relationships) {
                  // Get all the architects
                  var designerUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_OBJECT);
                  if (designerUris.length) {
                    return Entity.loadList(designerUris, false).then(function(entities) {
                      entities = GraphHelper.graphValues(entities);
                      designers.architects = $filter('filter')(entities, function(entity) {
                        return entity.type === 'architect';
                      });
                      designers.firms = $filter('filter')(entities, function(entity) {
                        return entity.type === 'firm';
                      });
                      return designers;
                    });
                  } else {
                    return designers;
                  }
                });
              } ]
        },
        controller : 'StructureCtrl'
      });
    });