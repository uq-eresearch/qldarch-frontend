'use strict';

angular.module('angularApp')
    .controller('CreateTimelineCtrl', function ($scope, Entity, Uris) {
        console.log('hello?');
        $scope.hello = 'test';
        $scope.dates = [];

        $scope.date = {};
        var startDate = String(Math.floor(1900 + (Math.random() * 200)));
        console.log('start date', startDate);

        $scope.date.startDate = startDate;

        // Setup the select boxes
        $scope.entitySelectOptions = {
            placeholder: 'Subject',
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