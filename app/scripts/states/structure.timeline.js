'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('structure.timeline', {
        url : '/timeline',
        templateUrl : 'views/timeline.html',
        resolve : {
          data : [ 'Relationship', 'GraphHelper', 'Entity', '$stateParams', '$filter', 'Uris',
              function(Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {

                var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
                // Get all the relationships
                return Relationship.findByEntityUri(structureUri).then(function(relationships) {
                  var relationshipsWithDates = $filter('filter')(relationships, function(relationship) {
                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                  });
                  return Relationship.getData(relationshipsWithDates);
                });
              } ],
          entity : [ 'Structure', '$stateParams', 'GraphHelper', function(Structure, $stateParams, GraphHelper) {
            var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
            return Structure.load(structureUri, false);
          } ]
        },
        controller : 'TimelineCtrl'
      });
    });