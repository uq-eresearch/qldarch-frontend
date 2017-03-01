'use strict';

angular.module('qldarchApp').config(
    function($stateProvider) {
      $stateProvider.state('structure.lineDrawing', {
        url : '/line-drawing/:lineDrawingId',
        templateUrl : 'views/linedrawing.html',
        resolve : {
          lineDrawing : [ 'Expression', '$stateParams', 'GraphHelper', 'Uris', 'Structure',
              function(Expression, $stateParams, GraphHelper, Uris, Structure) {
                var lineDrawingUri = GraphHelper.decodeUriString($stateParams.lineDrawingId);
                return Expression.load(lineDrawingUri, 'qldarch:LineDrawing').then(function(lineDrawing) {
                  // Loading building if its there
                  if (angular.isDefined(lineDrawing[Uris.QA_DEPICTS_BUILDING])) {
                    return Structure.load(lineDrawing[Uris.QA_DEPICTS_BUILDING]).then(function(structure) {
                      lineDrawing.building = structure;
                      return lineDrawing;
                    });
                  } else {
                    return lineDrawing;
                  }
                });
              } ]
        },
        controller : [ '$scope', 'lineDrawing', function($scope, lineDrawing) {
          $scope.lineDrawing = lineDrawing;
        } ]
      });
    });