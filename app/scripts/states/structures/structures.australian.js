'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structures.australian', {
    url : '?index',
    templateUrl : 'views/structures.html',
    controller : 'StructuresCtrl',
    resolve : {
      structures : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {        
        return AggArchObjs.loadProjects().then(function(data) {
          return $filter('filter')(data, function(structure) {
            if (structure.australian === true) {
              if (structure.lng) {
                structure.lon = structure.lng;
              }
              return structure;
            }
          });
        }).catch(function() {
          console.log('unable to load australian projects');
          return {};
        });
      } ]
    }
  });
});