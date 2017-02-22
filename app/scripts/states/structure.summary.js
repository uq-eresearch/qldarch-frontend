'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.summary', {
    url : '/summary',
    templateUrl : 'views/structure/summary.html',
    resolve : {
      designers : [ 'structure', '$filter', '$http', 'Uris', function(structure, $filter, $http, Uris) {
        /* globals _:false */
        var designers = {
          architects : [],
          firms : []
        };
        var person = $filter('filter')(structure.relationships, function(relationship) {
          if (relationship.subjectype === 'person') {
            return $http.get(Uris.WS_ROOT + 'archobj/' + relationship.subject).then(function(result) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(result.data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
                }).id;
              }
              return relationship;
            });
          }
        });
        designers.architects = _.uniqBy(person, 'subjectlabel');
        var firm = $filter('filter')(structure.relationships, function(relationship) {
          if (relationship.subjectype === 'firm') {
            return $http.get(Uris.WS_ROOT + 'archobj/' + relationship.subject).then(function(result) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(result.data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
                }).id;
              }
              return relationship;
            });
          }
        });
        designers.firms = _.uniqBy(firm, 'subjectlabel');
        return designers;
      } ]
    },
    controller : 'StructureCtrl'
  });
});