'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('firm.timeline', {
        url : '/timeline',
        templateUrl : 'views/timeline.html',
        resolve : {
          data : [ 'Relationship', 'GraphHelper', 'Entity', '$stateParams', '$filter', 'Uris',
              function(Relationship, GraphHelper, Entity, $stateParams, $filter, Uris) {

                var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
                // Get all the relationships
                return Relationship.findByEntityUri(firmUri).then(function(relationships) {
                  var relationshipsWithDates = $filter('filter')(relationships, function(relationship) {
                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                  });
                  return Relationship.getData(relationshipsWithDates);
                });
              } ],
          entity : [ 'Firm', '$stateParams', 'GraphHelper', function(Firm, $stateParams, GraphHelper) {
            var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
            return Firm.load(firmUri, false);
          } ]
        },
        controller : 'TimelineCtrl'
      });
    });