'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('firm.photographs', {
    url : '/photographs',
    templateUrl : 'views/firm/photographs.html',
    resolve : {
      photographs : [ 'firm', '$filter', function(firm, $filter) {
        return $filter('filter')(firm.media, function(media) {
          return media.type === ('Photograph' || 'Portrait' || 'Image');
        });
      } ]
    },
    controller : [ '$scope', 'photographs', 'LayoutHelper', function($scope, photographs, LayoutHelper) {
      $scope.photographRows = LayoutHelper.group(photographs, 6);
    } ]
  });
});