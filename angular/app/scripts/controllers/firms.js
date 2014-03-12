'use strict';

angular.module('angularApp')
    .controller('FirmsCtrl', function ($scope, firms, Uris, GraphHelper, LayoutHelper, $http, ENV, australian) {
        var DEFAULT_FIRM_ROW_COUNT = 5;
        $scope.firmRowDisplayCount = DEFAULT_FIRM_ROW_COUNT;
        $scope.australian = australian;

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
            dates: []
        };

        // Australian firms, show the timeline
        if (australian) {
            var container = document.getElementById('chart');
            jQuery(container).css('height', '600px');

            var chart = new google.visualization.Timeline(container);

            var dataTable = new google.visualization.DataTable();

            dataTable.addColumn({
                type: 'string',
                id: 'President'
            });
            dataTable.addColumn({
                type: 'string',
                id: 'Name'
            });
            dataTable.addColumn({
                type: 'date',
                id: 'Start'
            });
            dataTable.addColumn({
                type: 'date',
                id: 'End'
            });

            // setTimeout(function () {
            //     console.log('ready to listen');
            //     var $container = jQuery(container);
            //     $container.find('rect').click(function (event) {
            //         console.log('got a click');
            //         setTimeout(function () {
            //             // find rect with stroke
            //             var $rect = $container.find('rect[stroke-width="3"]');
            //             var text = $rect.next().html();
            //             alert(text);
            //         }, 0);
            //     });
            // }, 3000);
            // 
            var url;
            if (ENV.name === 'development') {
                url = 'files/firms.json';
            } else {
                url = 'files/firms.json';
            }

            $http.get(url).then(function (response) {

                var years = response.data[0];

                for (var i = 1; i < response.data.length; i++) {
                    var row = response.data[i];
                    var date = {
                        'endDate': '1949',
                        'headline': 'my headline',
                        'text': '<p>Body text goes here, some HTML is OK</p>',
                        'tag': 'This is Optional',
                        'classname': 'optionaluniqueclassnamecanbeaddedhere',
                    };
                    var hasFirm = false;
                    for (var j = 0; j < row.length; j++) {
                        var cell = row[j];
                        var cellYear = years[j].split('-')[0];
                        if (cell) {
                            // Not empty cell
                            if (cell !== '') {
                                // we have some value
                                // @todo: check if its the current data
                                if (date.startDate) {
                                    // Set the end date
                                    date.endDate = cellYear;
                                } else {
                                    // Create a new date
                                    date.startDate = cellYear;
                                    date.endDate = cellYear;
                                    date.headline = cell;
                                    hasFirm = true;
                                }
                            }
                        }
                    }
                    if (hasFirm) {
                        // if (i < 70) {
                        var rowData = [date.headline, date.headline, new Date(date.startDate, 0, 1), new Date(date.endDate, 11, 31)];
                        // console.log('rowData', rowData);
                        dataTable.addRow(rowData);

                        // $scope.timeline.dates.push(date);
                        // }
                    }
                }
                var options = {
                    timeline: {
                        colorByRowLabel: true
                    }
                };
                chart.draw(dataTable, options);
            });
        }
    });