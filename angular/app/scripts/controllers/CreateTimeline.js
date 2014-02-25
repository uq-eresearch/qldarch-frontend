'use strict';

angular.module('angularApp')
    .controller('CreateTimelineCtrl', function ($scope, Entity, Uris, $stateParams, $location) {
        $scope.isEditing = false;
        if ($stateParams.timeline) {
            $scope.isNew = false;
            $scope.timeline = angular.fromJson($stateParams.timeline);
            console.log('timelien hellope', $scope.timeline);
        } else {
            $scope.isNew = true;
            $scope.timeline = {
                dates: []
            };
        }

        $scope.isAddingDate = false;
        $scope.showAddDate = function () {
            $scope.date = {};
            // var startDate = String(Math.floor(1900 + (Math.random() * 200)));
            // $scope.date.startDate = startDate;
            $scope.isAddingDate = true;
        };

        /**
         * Adds a new date to the timeline
         * @param {[type]} date [description]
         */
        $scope.addDate = function (date) {
            if (!date.startDate || date.startDate.length === 0) {

            }
            // Setup the asset image
            if (date.entity) {
                date.asset = {
                    media: 'images/icon.png',
                    thumbnail: 'images/icon.png',
                    caption: '<h4><a href="#/' + date.entity.type + '/' + date.entity.encodedUri + '">' + date.entity.name + '</a></h4>'
                };
                if (date.entity.picture) {
                    date.asset.media = Uris.FILE_ROOT + date.entity.picture[Uris.QA_SYSTEM_LOCATION];
                    date.asset.thumbnail = Uris.THUMB_ROOT + date.entity.picture[Uris.QA_SYSTEM_LOCATION];
                }
            }
            $scope.timeline.dates.push(date);
            $scope.isAddingDate = false;

            $location.search({
                timeline: angular.toJson($scope.timeline)
            });
        };
        $scope.removeDate = function (date) {
            var index = $scope.timeline.dates.indexOf(date);
            $scope.timeline.dates.splice(index, 1);
            if ($scope.timeline.dates.length === 0) {
                $scope.isEditing = false;
            }
            $location.search({
                timeline: angular.toJson($scope.timeline)
            });
        };

        $scope.hideAddDate = function () {
            $scope.isAddingDate = false;
        };


        // Setup the select boxes
        $scope.entitySelectOptions = {
            placeholder: 'Who or what is this about?',
            dropdownAutoWidth: true,
            minimumInputLength: 2,
            query: function (options) {
                Entity.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: []
                    };
                    angular.forEach(entities, function (entity) {
                        data.results.push({
                            id: entity.uri,
                            uri: entity.uri,
                            text: entity.name,
                            type: entity.type,
                            name: entity.name,
                            encodedUri: entity.encodedUri,
                            picture: entity.picture
                        });
                    });
                    options.callback(data);
                });
            }
        };


        $scope.add = function () {

            $scope.date.asset = {
                'media': Uris.FILE_ROOT + $scope.date.entity.picture[Uris.QA_SYSTEM_LOCATION],
                'thumbnail': Uris.THUMB_ROOT + $scope.date.entity.picture[Uris.QA_SYSTEM_LOCATION],
                'caption': '<h4>' + $scope.date.entity.name + '</h4>'
            };
            // 'endDate': '2011,12,11',
            // 'text': '<p>Body text goes here, some HTML is OK</p>',
            // 'tag': 'This is Optional',
            // 'classname': 'optionaluniqueclassnamecanbeaddedhere',
            // 'asset': {
            // 'media': 'http://twitter.com/ArjunaSoriano/status/164181156147900416',
            // 'credit': 'Credit Name Goes Here',
            // 'caption': 'Caption text goes here'
            // }
            // };

            $scope.dates.push($scope.date);

            console.log($scope.dates);
            $scope.date = {};
        };
    });