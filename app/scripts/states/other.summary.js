'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('other.summary', {
    url : '/summary',
    templateUrl : 'views/other/summary.html',
    resolve : {
      types : [ 'Ontology', function(Ontology) {
        console.log('loading summary');
        return Ontology.loadAllEditableEntityTypes();
      } ]
    },
    controller : 'OtherCtrl'
  });
});