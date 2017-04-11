'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.lineDrawings', {
    url : '/line-drawings',
    templateUrl : 'views/structure/linedrawings.html',
    resolve : {
      lineDrawings : [ 'structure', '$filter', function(structure, $filter) {
        return $filter('filter')(structure.media, function(media) {
          return (media.type === 'LineDrawing');
        });
      } ]
    },
    controller : [ '$scope', 'lineDrawings', 'LayoutHelper', function($scope, lineDrawings, LayoutHelper) {
      $scope.lineDrawingRows = LayoutHelper.group(lineDrawings, 6);
    } ]
  });
});