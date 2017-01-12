'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.photographs', {
    url : '/photographs',
    templateUrl : 'views/firm/photographs.html',
    resolve : {
      photographs : [ 'GraphHelper', 'Firm', 'Expression', '$stateParams', function(GraphHelper, Firm, Expression, $stateParams) {
        var firmUri = GraphHelper.decodeUriString($stateParams.firmId);
        return Expression.findByFirmUris([ firmUri ], 'qldarch:Photograph');
      } ]
    },
    controller : [ '$scope', 'photographs', 'LayoutHelper', function($scope, photographs, LayoutHelper) {
      $scope.photographRows = LayoutHelper.group(photographs, 6);
    } ]
  });
});