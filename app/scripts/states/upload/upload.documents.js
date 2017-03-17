'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('upload.documents', {
    url : '/documents',
    templateUrl : 'views/upload.documents.html',
    resolve : {
      structures : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {        
        return AggArchObjs.loadProjects().then(function(data) {
          return $filter('filter')(data, function(structure) {
            return structure.label && !(/\s/.test(structure.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load projects');
          return {};
        });
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
    controller : 'UploadDocumentsCtrl'
  });
});