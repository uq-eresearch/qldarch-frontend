'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('search', {
    url : '/search?query',
    templateUrl : 'views/search.html',
    resolve : {
      architects : [ 'AggArchObjs', 'GraphHelper', '$filter', function(AggArchObjs, GraphHelper, $filter) {
        return AggArchObjs.loadArchitects().then(function(data) {
          var architects = GraphHelper.graphValues(data);
          return $filter('filter')(architects, function(architect) {
            return architect.label && !(/\s/.test(architect.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load all architects');
          return {};
        });
      } ],
      firms : [ 'AggArchObjs', '$filter', function(AggArchObjs, $filter) {
        return AggArchObjs.loadFirms().then(function(data) {
          return $filter('filter')(data, function(firm) {
            return firm.label && !(/\s/.test(firm.label.substring(0, 1)));
          });
        }).catch(function() {
          console.log('unable to load all firms');
          return {};
        });
      } ],
      structures : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadProjects().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load all projects');
          return {};
        });
      } ],
      personnotarchitect : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadPersonNotArchitect().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load person non-architect');
          return {};
        });
      } ],
      othersnotperson : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadOthersNotPerson().then(function(data) {
          return data;
        }).catch(function() {
          console.log('unable to load others non-person');
          return {};
        });
      } ]
    },
    controller : 'SearchCtrl'
  });
});