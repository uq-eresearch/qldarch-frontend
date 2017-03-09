'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architects.other', {
    url : '/other?index',
    templateUrl : 'views/architects/architects.html',
    controller : 'ArchitectsCtrl',
    resolve : {
      architects : [ 'AggArchObjs', 'GraphHelper',  '$filter', function( AggArchObjs, GraphHelper, $filter) {        
        return AggArchObjs.loadArchitects().then(function(data) {
          var architects = GraphHelper.graphValues(data);
          return $filter('filter')(architects, function(architect) {
            return architect.practicedinqueensland === false && (architect.label && !(/\s/.test(architect.label.substring(0, 1))));
          });
        }).catch(function() {
          console.log('unable to load other architects');
          return {};
        });
      } ],
      practicedinqueensland : function() {
        return false;
      }
    }
  });
});