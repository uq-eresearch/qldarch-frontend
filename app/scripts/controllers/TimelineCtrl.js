'use strict';

angular.module('qldarchApp').controller('TimelineCtrl', function($scope, $filter, data, Timeline) {

  $scope.isShowingTimeline = false;
  var relationships = $filter('filter')(data.relationships, function(relationship) {
    return (relationship.fromyear || relationship.untilyear || relationship.objectcompletion);
  });

  $scope.entity = data;

  if (relationships.length) {
    $scope.isShowingTimeline = true;
    $scope.dates = Timeline.relationshipsToEvents(relationships, data.id);
  }
});