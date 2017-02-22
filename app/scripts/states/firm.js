'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm', {
    abstract : true,
    url : '/firm?firmId',
    templateUrl : 'views/firm/layout.html',
    resolve : {
      firm : [ '$stateParams', '$http', 'Uris', 'Relationshiplabels', function($stateParams, $http, Uris, Relationshiplabels) {
        if (!$stateParams.firmId) {
          return {};
        } else {
          return $http.get(Uris.WS_ROOT + 'archobj/' + $stateParams.firmId).then(function(result) {
            angular.forEach(result.data.relationships, function(relationship) {
              if (Relationshiplabels.hasOwnProperty(relationship.relationship)) {
                relationship.relationship = Relationshiplabels[relationship.relationship];
              }
            });
            return result.data;
          });
        }
      } ]
    },
    controller : [ '$scope', 'firm', function($scope, firm) {
      $scope.firm = firm;
    } ]
  });
});