'use strict';

angular.module('qldarchApp').controller('TimelineViewerCtrl', function ($scope, compoundObject, Auth, CompoundObject, $state) {
  $scope.compoundObject = compoundObject.jsonData;
  $scope.timeline = compoundObject.jsonData.data;

  $scope.isEditable = Auth.success && ($scope.compoundObject.user.user === Auth.user.username || Auth.user.role === 'admin');
  $scope.isDeletable = Auth.success && ($scope.compoundObject.user.user === Auth.user.username || Auth.user.role === 'admin');

  $scope.delete = function () {
    var r = window.confirm('Delete this timeline?');
    if (r === true) {
      CompoundObject.delete(compoundObject.uri).then(function () {
        $state.go('main');
      });
    }
  };
});