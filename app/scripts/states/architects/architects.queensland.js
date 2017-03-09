'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architects.queensland', {
    url : '?index',
    templateUrl : 'views/architects/architects.html',
    controller : 'ArchitectsCtrl',
    resolve : {
      architects : ['AggArchObjs', 'GraphHelper', '$filter', function(AggArchObjs, GraphHelper, $filter) {        
        return AggArchObjs.loadArchitects().then(function(data) {
          var architects = GraphHelper.graphValues(data);
          return $filter('filter')(architects, function(architect) {
            return architect.practicedinqueensland === true && (architect.label && !(/\s/.test(architect.label.substring(0, 1))));
          });
        }).catch(function() {
          console.log('unable to load qld architects');
          return {};
        });
      } ],
      practicedinqueensland : function() {
        return true;
      }
    }
  });
});