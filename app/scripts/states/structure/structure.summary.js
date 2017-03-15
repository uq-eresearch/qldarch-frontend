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
          if (relationship.subjectype === 'person') {
            return ArchObj.load(relationship.subject).then(function(data) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
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
          if (relationship.subjectype === 'firm') {            
            return ArchObj.load(relationship.subject).then(function(data) {
              if (angular.isUndefined(relationship.media)) {
                relationship.media = $filter('filter')(data.media, function(med) {
                  return (med.preferred || (med.type === 'Photograph' || 'Portrait' || 'Image'));
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
      } ],
      firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {
        return AggArchObjs.loadFirms().then(function(data) {
          return $filter('filter')(data, function(firm) {
            return firm.label && !(/\s/.test(firm.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load firms');
          return {};
        });
      } ],
      architects : ['AggArchObjs', 'GraphHelper', '$filter', function(AggArchObjs,
          GraphHelper, $filter) {
        return AggArchObjs.loadArchitects().then(function(data) {
          return $filter('filter')(data, function(architect) {
            return architect.label && !(/\s/.test(architect.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load architects');
          return {};
        });
      } ]
    },
    controller : 'StructureCtrl'
  });
});