'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.photographs', {
    url : '/photographs',
    templateUrl : 'views/structure/photographs.html',
    resolve : {
      photographs : [ 'GraphHelper', 'Structure', 'Expression', '$stateParams', function(GraphHelper, Structure, Expression, $stateParams) {
        var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
        return Expression.findByBuildingUris([ structureUri ], 'qldarch:Photograph');
      } ]
    },
    controller : [ '$scope', 'photographs', 'LayoutHelper', function($scope, photographs, LayoutHelper) {
      $scope.photographRows = LayoutHelper.group(photographs, 6);
    } ]
  });
});