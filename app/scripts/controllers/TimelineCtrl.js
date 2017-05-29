'use strict';

angular.module('qldarchApp').controller('TimelineCtrl', function($scope, $filter, data, Uris, $state, Timeline) {

  $scope.isShowingTimeline = false;
  var relationships = $filter('filter')(data.relationships, function(relationship) {
    return (relationship.fromyear || relationship.untilyear || relationship.objectcompletion);
  });

  $scope.entity = data;

  /**
   * Opens this timeline in the timeline creator
   * 
   * @return {[type]} [description]
   */
  $scope.openInTimelineBuilder = function() {
    // console.log('opening in timeline creator');
    $state.go('create.timeline', {
      id : angular.toJson([ data.id ])
    });
  };

  if (relationships.length) {
    $scope.isShowingTimeline = true;
    $scope.dates = Timeline.relationshipsToEvents(relationships, data.id);
    // console.log($scope.dates);
  }
});