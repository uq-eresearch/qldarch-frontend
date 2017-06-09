'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc', {
    abstract : true,
    url : '/ugc?id',
    resolve : {
      compobj : [ '$stateParams', 'GraphHelper', 'CompObj', function($stateParams, GraphHelper, CompObj) {
        if ($stateParams.id) {
          return CompObj.load($stateParams.id).then(function(data) {
            return data;
          }).catch(function() {
            console.log('unable to load CompObj');
            return {};
          });
        } else {
          return {};
        }
      } ]
    },
    templateUrl : 'views/ugc/ugc.html'
  });
});