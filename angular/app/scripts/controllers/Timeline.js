'use strict';

angular.module('angularApp')
    .controller('TimelineCtrl', function ($scope, entity, data, Uris) {

        $scope.isShowingTimeline = false;
        $scope.entity = entity;

        if (data.relationships.length) {
            $scope.isShowingTimeline = true;

            if (angular.isDefined(entity.picture)) {
                $scope.asset = {
                    'media': Uris.FILE_ROOT + entity.picture[Uris.QA_SYSTEM_LOCATION]
                };
            }

            var dates = [];
            angular.forEach(data.relationships, function (relationship) {
                console.log('textual note', relationship, relationship[Uris.QA_TEXTUAL_NOTE]);
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
                if (relationship.subject.uri === entity.uri) {
                    // Use the object
                    timelineDate.asset = {
                        media: 'images/icon.png',
                        thumbnail: 'images/icon.png',
                        'caption': '<h3 style="text-transform: capitalize"><a href="#/' +
                            relationship.object.type + '/' + relationship.object.encodedUri + '">' + relationship.object.name + '</a></h3>'
                    };
                    if (angular.isDefined(relationship.object.picture)) {
                        var url = Uris.FILE_ROOT + relationship.object.picture[Uris.QA_SYSTEM_LOCATION];
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
                        var url = Uris.FILE_ROOT + relationship.subject.picture[Uris.QA_SYSTEM_LOCATION];
                        timelineDate.asset.thumbnail = url;
                        timelineDate.asset.media = url;
                    }
                }
                console.log(timelineDate);
                dates.push(timelineDate);
            });
            $scope.dates = dates;


        }

    });