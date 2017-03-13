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
    },
    controller : [ '$scope', 'firm', 'ArchObj', '$state', function($scope, firm, ArchObj, $state) {
      $scope.firm = firm;

      $scope.delete = function(firm) {
        var r = window.confirm('Delete firm ' + firm.label + '?');
        if (r === true) {
          ArchObj.delete(firm.id).then(function() {
            $state.go('firm.australian');
          });
        }
      };
    } ]
  });
});