'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('structure.photographs', {
    url : '/photographs',
    templateUrl : 'views/structure/photographs.html',
    resolve : {
      photographs : [ 'structure', '$filter', function(structure, $filter) {
        return $filter('filter')(structure.media, function(media) {
          return media.type === 'Photograph' || 'Portrait' || 'Image';
        });
      } ]
    },
    controller : [ '$scope', 'photographs', 'LayoutHelper', function($scope, photographs, LayoutHelper) {
      $scope.photographRows = LayoutHelper.group(photographs, 6);
    } ]
  });
});