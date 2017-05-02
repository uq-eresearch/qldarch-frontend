'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('relationships.create', {
    url : '/create?archobjId&archobjType',
    templateUrl : 'views/relationships/relationships.create.html',
    resolve : {
      types : [ 'RelationshipLabels', function(RelationshipLabels) {
        return RelationshipLabels.load().then(function(response) {
          return response;
        });
      } ],
      architects : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadArchitects().then(function(data) {
          angular.forEach(data, function(d) {
            d.type = 'person';
          });
          return data;
        }).catch(function() {
          console.log('unable to load architects');
          return {};
        });
      } ],
      firms : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadFirms().then(function(data) {
          angular.forEach(data, function(d) {
            d.type = 'firm';
          });
          return data;
        }).catch(function() {
          console.log('unable to load firms');
          return {};
        });
      } ],
      structures : [ 'AggArchObjs', function(AggArchObjs) {
        return AggArchObjs.loadProjects().then(function(data) {
          angular.forEach(data, function(d) {
            d.type = 'structure';
          });
          return data;
        }).catch(function() {
          console.log('unable to load projects');
          return {};
        });
      } ],
      architectsFirms : [ 'architects', 'firms', function(architects, firms) {
        var entities = [];
        Array.prototype.push.apply(entities, architects);
        Array.prototype.push.apply(entities, firms);
        return entities;
      } ]
    },
    controller : 'RelationshipsCreateCtrl'
  });
});