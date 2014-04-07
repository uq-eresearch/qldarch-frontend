'use strict';

angular.module('angularApp')
    .controller('TimelineViewerCtrl', function ($scope, compoundObject, Auth, CompoundObject, $state) {
        $scope.compoundObject = compoundObject.jsonData;
        $scope.timeline = compoundObject.jsonData.data;

        $scope.isEditable = Auth.auth && ($scope.compoundObject.user.user === Auth.user || Auth.role === 'editor' || Auth.role === 'root');
        $scope.isDeletable = Auth.auth && ($scope.compoundObject.user.user === Auth.user || Auth.role === 'root');

        $scope.delete = function () {
            var r = window.confirm('Delete this timeline?');
            if (r === true) {
                CompoundObject.delete(compoundObject.uri).then(function () {
                    $state.go('main');
                });
            }
        };
    });