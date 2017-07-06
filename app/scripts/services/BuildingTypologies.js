'use strict';

angular.module('qldarchApp').service('BuildingTypologies', function BuildingTypologies($http, Uris) {
  return {
    load : function() {
      return $http({
        method : 'GET',
        url : Uris.WS_ROOT + 'buildingtypologies',
        cache : true
      }).then(function(result) {
        console.log('load building typologies');
        return result.data;
      });
    }
  };
});