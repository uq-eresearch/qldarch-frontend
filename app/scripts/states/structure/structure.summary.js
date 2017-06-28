'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.summary', {
    url : '/summary',
    templateUrl : 'views/structure/summary.html',
    resolve : {
      designers : [ 'structure', '$filter', 'ArchObj', function(structure, $filter, ArchObj) {
        /* globals _:false */
        var designers = {
          architects : [],
          firms : []
        };
        var person = $filter('filter')(structure.relationships, function(relationship) {
          if (relationship.subjecttype === 'person') {
            return ArchObj.load(relationship.subject).then(function(data) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || med.type === 'Portrait' || med.type === 'Image'));
                }).id;
              }
              return relationship;
            }).catch(function() {
              console.log('unable to load relationship subject ArchObj');
              return {};
            });
          }
        });
        designers.architects = _.uniqBy(person, 'subjectlabel');
        var firm = $filter('filter')(structure.relationships, function(relationship) {
          if (relationship.subjecttype === 'firm') {            
            return ArchObj.load(relationship.subject).then(function(data) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || med.type === 'Portrait' || med.type === 'Image'));
                }).id;
              }
              return relationship;
            }).catch(function() {
              console.log('unable to load relationship subject ArchObj');
              return {};
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