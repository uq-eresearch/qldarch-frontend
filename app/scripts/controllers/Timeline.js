'use strict';

angular.module('angularApp')
    .controller('TimelineCtrl', function ($scope, entity, data, Uris, $state, Timeline) {

        $scope.isShowingTimeline = false;
        $scope.entity = entity;

        /**
         * Opens this timeline in the timeline creator
         * @return {[type]} [description]
         */
        $scope.openInTimelineBuilder = function () {
            console.log('opening in timeline creator');
            $state.go('create.timeline', {
                uris: angular.toJson([entity.uri])
            });
        };

        if (data.relationships.length) {
            $scope.isShowingTimeline = true;

            if (angular.isDefined(entity.picture)) {
                $scope.asset = {
                    'media': entity.picture.thumb
                };
            }
            $scope.dates = Timeline.relationshipsToEvents(data.relationships, entity);
        }
    });
