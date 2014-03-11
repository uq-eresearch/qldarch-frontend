'use strict';

angular.module('angularApp')
    .controller('FirmsCtrl', function ($scope, firms, Uris, GraphHelper, LayoutHelper, $http) {
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
            dates: []
        };

        $http.get('files/firms.json').then(function (response) {

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
                                date.headline = cell;
                                hasFirm = true;
                            }
                        }
                    }
                }
                // console.log('has firm?', hasFirm);
                if (hasFirm) {
                    if (i < 100) {
                        $scope.timeline.dates.push(date);
                    }
                }
            }
            // console.log('dates', $scope.timeline);
        });

        // $http.get('files/firms.csv').then(function (response) {
        //     var data = new jQuery.csv.toArrays(response.data);
        //     console.log('data is ', data);

        //     var years = data[0];
        //     // Go through all the rows (firm timelines)
        //     for (var i = 1; i < data.length; i++) {

        //         var row = data[i];

        //         // Setup an event for the timeline
        //         var date = {};

        //         // Go through all the cells
        //         for (var j = 0; i < row.length; j++) {
        //             var cell = row[j];
        //             if (cell) {
        //                 console.log('got a cell with a value', cell);
        //                 // var cellYears = years[j].split('-');
        //                 // var cellYear = cellYears[0];

        //                 // if (cell !== '') {
        //                 //     // we have some value
        //                 //     // @todo: check if its the current data
        //                 //     if (date.startDate) {
        //                 //         // Set the end date
        //                 //         date.endDate = cellYear;
        //                 //     } else {
        //                 //         // Create a new date
        //                 //         date.startDate = cellYear;
        //                 //         date.headline = cell;
        //                 //     }
        //                 // }
        //             }
        //         }
        //         // console.log('adding date', date);
        //         // $scope.timeline.dates.push(date);
        //     }

        // });

        // This will parse a delimited string into an array of
        // arrays. The default delimiter is the comma, but this
        // can be overriden in the second argument.
        function CSVToArray(strData, strDelimiter) {
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            strDelimiter = (strDelimiter || ",");

            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp(
                (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                ),
                "gi"
            );


            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [
                []
            ];

            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;


            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {

                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[1];

                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (
                    strMatchedDelimiter.length &&
                    (strMatchedDelimiter != strDelimiter)
                ) {

                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);

                }


                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[2]) {

                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    var strMatchedValue = arrMatches[2].replace(
                        new RegExp("\"\"", "g"),
                        "\""
                    );

                } else {

                    // We found a non-quoted value.
                    var strMatchedValue = arrMatches[3];

                }


                // Now that we have our value string, let's add
                // it to the data array.
                arrData[arrData.length - 1].push(strMatchedValue);
            }

            // Return the parsed data.
            return (arrData);
        }
    });