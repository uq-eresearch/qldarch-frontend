'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm', {
    abstract : true,
    url : '/firm?firmId',
    templateUrl : 'views/firm/layout.html',
    resolve : {
      firm : [ '$stateParams', 'ArchObj', function($stateParams, ArchObj) {
        if (!$stateParams.firmId) {
          return {};
        } else {
          return ArchObj.loadWithRelationshipLabels($stateParams.firmId).then(function(data) {
            return data;
          }).catch(function() {
            console.log('unable to load firm ArchObj with relationship labels');
            return {};
          });
        }
      } ]
    },
    controller : [ '$scope', 'firm', function($scope, firm) {
      $scope.firm = firm;
    } ]
  });
});