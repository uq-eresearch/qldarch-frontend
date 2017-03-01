'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('ugc', {
    abstract : true,
    url : '/ugc?id',
    resolve : {
      compoundObject : [ '$stateParams', 'GraphHelper', 'CompoundObject', function($stateParams, GraphHelper, CompoundObject) {
        if ($stateParams.id) {
          var mapUri = GraphHelper.decodeUriString($stateParams.id);
          return CompoundObject.load(mapUri);
        } else {
          return {
            jsonData : {
              data : {}
            }
          };
        }
      } ]
    },
    templateUrl : 'views/ugc/ugc.html'
  });
});