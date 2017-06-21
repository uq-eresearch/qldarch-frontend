'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc', {
    abstract : true,
    url : '/ugc?id',
    resolve : {
      compobj : [ '$stateParams', 'GraphHelper', 'CompObj', function($stateParams, GraphHelper, CompObj) {
        if ($stateParams.id) {
          return CompObj.load($stateParams.id).then(function(data) {
            if (data.type === 'timeline') {
              data.dates = angular.copy(data.timelineevent);
              delete data.timelineevent;
            }
            if (data.type === 'map') {
              data.locations = angular.copy(data.structure);
              delete data.structure;
            }
            if (data.type === 'wordcloud') {
              data.documents = angular.copy(data.wordcloud);
              delete data.wordcloud;
            }
            return data;
          }).catch(function() {
            console.log('unable to load CompObj');
            return {};
          });
        } else {
          return {};
        }
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
      arfist : [ 'architects', 'firms', 'structures', function(architects, firms, structures) {
        var arfist = [];
        Array.prototype.push.apply(arfist, architects);
        Array.prototype.push.apply(arfist, firms);
        Array.prototype.push.apply(arfist, structures);
        return arfist;
      } ]
    },
    templateUrl : 'views/ugc/ugc.html'
  });
});