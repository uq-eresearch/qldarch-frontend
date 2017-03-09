'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structures.other', {
    url : '/other?index',
    templateUrl : 'views/structures.html',
    controller : 'StructuresCtrl',
    resolve : {
      structures : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {        
        return AggArchObjs.loadProjects().then(function(data) {
          return $filter('filter')(data, function(structure) {
            if (structure.australian === false) {
              if (structure.lng) {
                structure.lon = structure.lng;
              }
              return structure;
            }
          });
        }).catch(function() {
          console.log('unable to load other projects');
          return {};
        });
      } ]
    }
  });
});