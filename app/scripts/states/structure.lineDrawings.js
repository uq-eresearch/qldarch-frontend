'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.lineDrawings', {
    url : '/line-drawings',
    templateUrl : 'views/structure/linedrawings.html',
    resolve : {
      lineDrawings : [ 'GraphHelper', '$stateParams', 'Expression', function(GraphHelper, $stateParams, Expression) {
        var structureUri = GraphHelper.decodeUriString($stateParams.structureId);
        return Expression.findByBuildingUris([ structureUri ], 'qldarch:LineDrawing');
      } ]
    },
    controller : [ '$scope', 'lineDrawings', 'LayoutHelper', function($scope, lineDrawings, LayoutHelper) {
      $scope.lineDrawingRows = LayoutHelper.group(lineDrawings, 6);
    } ]
  });
});