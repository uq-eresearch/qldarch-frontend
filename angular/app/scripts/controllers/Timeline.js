'use strict';

angular.module('angularApp')
    .controller('TimelineCtrl', function ($scope, entity, data, Uris, $timeout) {

        $scope.isShowingTimeline = false;

        if (data.relationships.length) {
            var dataObject = {
                'timeline': {
                    'headline': entity.name,
                    'type': 'default',
                    'text': '<p></p>',
                    'date': [],
                    'era': []
                }
            };
            if (angular.isDefined(entity.picture)) {
                dataObject.timeline.asset = {
                    'media': Uris.FILE_ROOT + entity.picture[Uris.QA_SYSTEM_LOCATION],
                    'credit': 'Credit Name Goes Here',
                    'caption': 'Caption text goes here'
                };
            }


            console.log('data', data);
            angular.forEach(data.relationships, function (relationship) {
                console.log('textual note', relationship, relationship[Uris.QA_TEXTUAL_NOTE]);
                var timelineDate = {};
                timelineDate.startDate = relationship[Uris.QA_START_DATE].substring(0, 4);
                if (angular.isDefined(relationship[Uris.QA_END_DATE])) {
                    timelineDate.endDate = relationship[Uris.QA_END_DATE].substring(0, 4);
                }

                timelineDate.headline = '<a href="#/' + relationship.subject.type + '/' + relationship.subject.encodedUri + '">' + relationship.subject.name + '</a> ' + relationship.predicate[Uris.QA_LABEL] + ' <a href="#/' + relationship.object.type + '/' + relationship.object.encodedUri + '">' + relationship.object.name + '</a>';
                if (angular.isDefined(relationship[Uris.QA_TEXTUAL_NOTE])) {
                    timelineDate.text = '<p>' + relationship[Uris.QA_TEXTUAL_NOTE] + '</p>';
                }
                // Get an image
                if (relationship.subject.uri === entity.uri) {
                    // Use the object
                    if (angular.isDefined(relationship.object.picture)) {
                        timelineDate.asset = {
                            'thumbnail': Uris.FILE_ROOT + relationship.object.picture[Uris.QA_SYSTEM_LOCATION],
                            'caption': relationship.object.name
                        };
                    }
                } else {
                    // Use the subject
                    if (angular.isDefined(relationship.subject.picture)) {
                        timelineDate.asset = {
                            'thumbnail': Uris.FILE_ROOT + relationship.subject.picture[Uris.QA_SYSTEM_LOCATION],
                            'caption': relationship.object.name
                        };
                    }
                }
                dataObject.timeline.date.push(timelineDate);
            });

            $scope.isShowingTimeline = true;
            $timeout(function () {
                createStoryJS({
                    type: 'timeline',
                    width: $('#my-timeline').width(),
                    height: '600',
                    source: dataObject,
                    'embed_id': 'my-timeline',
                    css: 'bower_components/timelinejs/build/css/timeline.css',
                    js: 'bower_components/timelinejs/build/js/timeline.js'
                });
            }, 0);
        }

    });