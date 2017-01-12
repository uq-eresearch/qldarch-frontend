'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('firm.structures', {
        url : '/projects',
        templateUrl : 'views/firm/structures.html',
        resolve : {
          structures : [ '$stateParams', 'GraphHelper', 'Uris', 'Structure', 'Relationship',
              function($stateParams, GraphHelper, Uris, Structure, Relationship) {
                var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                return Relationship.findBySubjectPredicateObject({
                  predicate : 'qldarch:designedBy',
                  object : firmUri
                }).then(function(relationships) {
                  // Get all the architects
                  var structureUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);

                  return Structure.loadList(structureUris, true).then(function(structures) {
                    var relationshipStructures = GraphHelper.graphValues(structures);

                    // Get the associated firms...this is awful
                    // should be all relationships or nothing!
                    return Structure.findByAssociatedFirmUri(firmUri).then(function(firmStructures) {
                      var structures = angular.extend(relationshipStructures, firmStructures);
                      return GraphHelper.graphValues(structures);
                    });
                  });
                });
              } ]
        },
        controller : [ '$scope', 'firm', 'structures', 'LayoutHelper', function($scope, firm, structures, LayoutHelper) {
          $scope.firm = firm;
          $scope.structureRows = LayoutHelper.group(structures, 6);
        } ]
      });
    });