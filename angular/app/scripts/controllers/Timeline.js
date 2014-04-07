'use strict';

angular.module('angularApp')
    .controller('TimelineCtrl', function ($scope, entity, data, Uris, $state) {

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

            var dates = [];
            angular.forEach(data.relationships, function (relationship) {

                var timelineDate = {};
                timelineDate.startDate = relationship[Uris.QA_START_DATE].substring(0, 4);
                if (angular.isDefined(relationship[Uris.QA_END_DATE])) {
                    timelineDate.endDate = relationship[Uris.QA_END_DATE].substring(0, 4);
                }

                // timelineDate.headline = '<a href="#/' + relationship.subject.type + '/' + relationship.subject.encodedUri + '">' + relationship.subject.name + '</a> ' + relationship.predicate[Uris.QA_LABEL].toLowerCase() + ' <a href="#/' + relationship.object.type + '/' + relationship.object.encodedUri + '">' + relationship.object.name + '</a>';
                timelineDate.headline = relationship.subject.name + ' ' + relationship.predicate[Uris.QA_LABEL].toLowerCase() + ' ' + relationship.object.name;
                if (angular.isDefined(relationship[Uris.QA_TEXTUAL_NOTE])) {
                    timelineDate.text = '<p>' + relationship[Uris.QA_TEXTUAL_NOTE] + '</p>';
                } else {
                    timelineDate.text = '<p></p>';
                }
                // Get an image
                var url = '';
                if (relationship.subject.uri === entity.uri) {
                    // Use the object
                    timelineDate.asset = {
                        media: 'images/icon.png',
                        thumbnail: 'images/icon.png',
                        'caption': '<h3 style="text-transform: capitalize"><a href="#/' +
                            relationship.object.type + '/' + relationship.object.encodedUri + '">' + relationship.object.name + '</a></h3>'
                    };
                    if (angular.isDefined(relationship.object.picture)) {
                        url = relationship.object.picture.thumb;
                        timelineDate.asset.thumbnail = url;
                        timelineDate.asset.media = url;
                    }
                } else {
                    // Use the subject
                    timelineDate.asset = {
                        media: 'images/icon.png',
                        thumbnail: 'images/icon.png',
                        'caption': '<h3 style="text-transform: capitalize"><a href="#/' +
                            relationship.subject.type + '/' + relationship.subject.encodedUri + '">' + relationship.subject.name + '</a></h3>'
                    };
                    if (angular.isDefined(relationship.subject.picture)) {
                        url = relationship.subject.picture.thumb;
                        timelineDate.asset.thumbnail = url;
                        timelineDate.asset.media = url;
                    }
                }
                dates.push(timelineDate);
            });
            $scope.dates = dates;


        }

    });