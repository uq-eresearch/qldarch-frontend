'use strict';

angular.module('angularApp')
    .directive('timeline', function ($timeout) {
        var TIMELINE_HEIGHT = 600;

        return {
            template: '<div></div>',
            restrict: 'E',
            replace: true,
            scope: {
                headline: '@', // 
                subtitle: '@', // subtitle
                asset: '=', // URL of image
                dates: '='
            },
            link: function postLink($scope, element) {
                // Generate a random id since we cant use jquery selectors
                // to initialize this timeline (annoying!)
                var id = 'timeline' + (new Date()).getTime();
                element.attr('id', id);

                $scope.$watch('dates', function (dates) {
                    if (dates && dates.length) {
                        element.html('');
                        console.log('making now');
                        var timelineData = {
                            timeline: {
                                headline: $scope.headline || '',
                                type: 'default',
                                text: $scope.subtitle || '<p></p>',
                                date: $scope.dates
                                // 'date': [],
                                // 'era': []
                            }
                        };

                        if (angular.isDefined($scope.asset)) {
                            console.log('asset is', $scope.asset);
                            timelineData.timeline.asset = $scope.asset;
                        }

                        $timeout(function () {
                            var test = createStoryJS({
                                type: 'timeline',
                                width: element.width(),
                                height: TIMELINE_HEIGHT,
                                source: timelineData,
                                'embed_id': id,
                                css: 'bower_components/timelinejs/build/css/timeline.css',
                                js: 'bower_components/timelinejs/build/js/timeline.js'
                            });
                        }, 0);
                    }
                }, true);

                // angular.forEach(data.relationships, function (relationship) {
                //     console.log('textual note', relationship, relationship[Uris.QA_TEXTUAL_NOTE]);
                //     var timelineDate = {};
                //     timelineDate.startDate = relationship[Uris.QA_START_DATE].substring(0, 4);
                //     if (angular.isDefined(relationship[Uris.QA_END_DATE])) {
                //         timelineDate.endDate = relationship[Uris.QA_END_DATE].substring(0, 4);
                //     }

                //     timelineDate.headline = '<a href="#/' + relationship.subject.type + '/' + relationship.subject.encodedUri + '">' + relationship.subject.name + '</a> ' + relationship.predicate[Uris.QA_LABEL].toLowerCase() + ' <a href="#/' + relationship.object.type + '/' + relationship.object.encodedUri + '">' + relationship.object.name + '</a>';
                //     if (angular.isDefined(relationship[Uris.QA_TEXTUAL_NOTE])) {
                //         timelineDate.text = '<p>' + relationship[Uris.QA_TEXTUAL_NOTE] + '</p>';
                //     }
                //     // Get an image
                //     if (relationship.subject.uri === entity.uri) {
                //         // Use the object
                //         if (angular.isDefined(relationship.object.picture)) {
                //             timelineDate.asset = {
                //                 'thumbnail': Uris.FILE_ROOT + relationship.object.picture[Uris.QA_SYSTEM_LOCATION],
                //                 'caption': relationship.object.name
                //             };
                //         }
                //     } else {
                //         // Use the subject
                //         if (angular.isDefined(relationship.subject.picture)) {
                //             timelineDate.asset = {
                //                 'thumbnail': Uris.FILE_ROOT + relationship.subject.picture[Uris.QA_SYSTEM_LOCATION],
                //                 'caption': relationship.object.name
                //             };
                //         }
                //     }
                //     timelineData.timeline.date.push(timelineDate);
                // });


            }
        };
    });