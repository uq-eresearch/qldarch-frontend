'use strict';

angular.module('angularApp')
    .directive('timeline', function ($timeout) {
        var TIMELINE_HEIGHT = 600;
        var UPDATE_DELAY = 500;
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

                // element.height(TIMELINE_HEIGHT).css('border', '1px solid #DDD').css('border-radius', '3px').css('background-color', '#EEE');
                // Generate a random id since we cant use jquery selectors
                // to initialize this timeline (annoying!)
                var id = 'timeline' + (new Date()).getTime();
                element.attr('id', id);

                var headlineTimer = null;
                $scope.$watch('headline', function (headline, headlineOld) {
                    if (headline !== headlineOld) {
                        if (headline === '') {
                            // No headline
                            reset();
                        } else {
                            // Changed headline
                            // We wait a certain amount of time before doing the update
                            if (headlineTimer) {
                                $timeout.cancel(headlineTimer);
                            }
                            headlineTimer = $timeout(function () {
                                restart();
                            }, UPDATE_DELAY);
                        }
                    }
                });

                var subtitleTimer = null;
                $scope.$watch('subtitle', function (subtitle, subtitleOld) {
                    if (subtitle !== subtitleOld) {
                        if (subtitleTimer) {
                            $timeout.cancel(subtitleTimer);
                        }
                        subtitleTimer = $timeout(function () {
                            restart();
                        }, UPDATE_DELAY);
                    }
                });


                var datesTimer = null;
                /**
                 * Watches dates for changes.
                 * Waits for a set delay before updating the dates.
                 *
                 * @param  {[type]} dates
                 * @return {[type]}       [description]
                 */
                $scope.$watch('dates', function (dates) {
                    if (datesTimer) {
                        $timeout.cancel(datesTimer);
                    }
                    datesTimer = $timeout(function () {
                        if (dates && dates.length) {
                            // Clear a timeline if its there, and create a new one
                            restart();
                        } else if (dates) {
                            // No dates recorded, make no timeline
                            reset();
                        }
                    }, UPDATE_DELAY);
                }, true);

                function reset() {
                    console.log('clearing timeline');
                    element.removeClass();
                    // element.removeAttr('style');
                    element.html('');
                }

                function restart() {
                    reset();
                    $timeout(function () {
                        create();
                    }, 0);
                }

                function create() {
                    if (!$scope.dates.length) {
                        return;
                    }
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

                    createStoryJS({
                        type: 'timeline',
                        width: element.width(),
                        height: TIMELINE_HEIGHT,
                        source: timelineData,
                        'embed_id': id,
                        css: 'bower_components/timelinejs/build/css/timeline.css',
                        js: 'bower_components/timelinejs/build/js/timeline.js'
                    });
                }

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