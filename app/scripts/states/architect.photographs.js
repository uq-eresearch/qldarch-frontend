'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('architect.photographs', {
    url : '/photographs',
    templateUrl : 'views/architect/photographs.html',
    resolve : {
      photographs : [ 'GraphHelper', 'Structure', 'Expression', '$stateParams', function(GraphHelper, Structure, Expression, $stateParams) {
        var architectUri = GraphHelper.decodeUriString($stateParams.architectId);
        return Expression.findByArchitectUris([ architectUri ], 'qldarch:Photograph');
      } ]
    },
    controller : [ '$scope', 'photographs', 'LayoutHelper', function($scope, photographs, LayoutHelper) {
      $scope.photographRows = LayoutHelper.group(photographs, 6);
    } ]
  });
});