'use strict';

angular.module('angularApp')
    .controller('FirmsCtrl', function ($scope, firms, Uris, GraphHelper, LayoutHelper) {
        var DEFAULT_FIRM_ROW_COUNT = 5;
        $scope.firmRowDisplayCount = DEFAULT_FIRM_ROW_COUNT;

        $scope.firms = firms;
        $scope.firmRows = LayoutHelper.group(GraphHelper.graphValues(firms), 6);

        /**
         * Adds more exchanges to the UI
         */
        $scope.addMoreFirmRows = function () {
            $scope.firmRowDisplayCount += 5;
        };

        $scope.timeline = {
            headline: 'Timeline headline',
            text: '<b>hello</b>',
            asset: {

            },
            dates: [{
                'startDate': '1945',
                'endDate': '1949',
                'headline': '',
                'text': '<p>Body text goes here, some HTML is OK</p>',
                'tag': 'This is Optional',
                'classname': 'optionaluniqueclassnamecanbeaddedhere',
                'asset': {
                    'media': 'http://twitter.com/ArjunaSoriano/status/164181156147900416',
                    'thumbnail': 'optional-32x32px.jpg',
                    'credit': 'Credit Name Goes Here',
                    'caption': 'Caption text goes here'
                }
            }]
        };


    });