'use strict';

angular.module('qldarchApp').service('RelationshipLabels', function RelationshipLabels($http, Uris) {
  return {
    load : function() {
      return $http({
        method : 'GET',
        url : Uris.WS_ROOT + 'relationship/labels',
        cache : true
      }).then(function(result) {
        console.log('load relationship labels');
        return result.data;
      });
    }
  };
});