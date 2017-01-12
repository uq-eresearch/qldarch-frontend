'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('architect.timeline', {
        url : '/timeline',
        templateUrl : 'views/timeline.html',
        resolve : {
          data : [ 'Relationship', 'GraphHelper', 'Entity', '$stateParams', '$filter', 'Uris',
              function(Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {
                var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
                // Get all the relationships
                return Relationship.findByEntityUri(architectUri).then(function(relationships) {
                  var relationshipsWithDates = $filter('filter')(relationships, function(relationship) {
                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                  });
                  return Relationship.getData(relationshipsWithDates);
                });
              } ],
          entity : [ 'Architect', '$stateParams', 'GraphHelper', function(Architect, $stateParams, GraphHelper) {
            var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
            return Architect.load(architectUri, false);
          } ]
        },
        controller : 'TimelineCtrl'
      });
    });