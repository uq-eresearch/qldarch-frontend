'use strict';

angular.module('qldarchApp').controller(
    'FirmsTimelineCtrl',
    function($scope, firms, GraphHelper, LayoutHelper, $http, australian, $stateParams, $state, $timeout, $filter, Firm) {

      var DEFAULT_FIRM_ROW_COUNT = 5, data = null;
      $scope.firmRowDisplayCount = DEFAULT_FIRM_ROW_COUNT;
      $scope.australian = australian;
      $scope.$stateParams = $stateParams;
      $scope.indexes = {
        '#' : false,
        'A' : false,
        'B' : false,
        'C' : false,
        'D' : false,
        'E' : false,
        'F' : false,
        'G' : false,
        'H' : false,
        'I' : false,
        'J' : false,
        'K' : false,
        'L' : false,
        'M' : false,
        'N' : false,
        'O' : false,
        'P' : false,
        'Q' : false,
        'R' : false,
        'S' : false,
        'T' : false,
        'U' : false,
        'V' : false,
        'W' : false,
        'X' : false,
        'Y' : false,
        'Z' : false
      };

      firms = $filter('orderBy')(GraphHelper.graphValues(firms), function(firm) {
        return firm.label;
      });

      function isLetter(char) {
        return char.match(/[a-z]/i);
      }

      function makeChart(data) {
        // Setup the chart
        var container = document.getElementById('chart');
        var $container = jQuery(container);
        $container.css('height', '600px');

        var chart = new google.visualization.Timeline(container);

        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({
          type : 'string',
          id : 'President'
        });
        dataTable.addColumn({
          type : 'string',
          id : 'Name'
        });
        dataTable.addColumn({
          type : 'date',
          id : 'Start'
        });
        dataTable.addColumn({
          type : 'date',
          id : 'End'
        });

        // Process the data
        var years = data[0];
        var hasData = false;

        for (var i = 1; i < data.length; i++) {
          var row = data[i];
          var date = {
            'endDate' : '1949',
            'headline' : 'my headline',
            'text' : '<p>Body text goes here, some HTML is OK</p>',
            'tag' : 'This is Optional',
            'classname' : 'optionaluniqueclassnamecanbeaddedhere',
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
                  // Enable indexes because we have a firm that starts with that
                  // letter
                  if (cell.length) {
                    var startLetter = cell.substring(0, 1).toUpperCase();
                    if (!isNaN(startLetter)) {
                      $scope.indexes['#'] = true;
                    } else if (isLetter(startLetter)) {
                      $scope.indexes[startLetter] = true;
                    }
                  }

                  if (!$stateParams.index || $stateParams.index === 'null' || ($stateParams.index && cell.substring(0, 1) === $stateParams.index) ||
                      ($stateParams.index === '#' && !isNaN(cell.substring(0, 1)))) {
                    // Create a new date
                    hasData = true;
                    date.startDate = cellYear;
                    date.endDate = cellYear;
                    date.headline = cell;
                    hasFirm = true;
                  }
                }
              }
            }
          }
          if (hasFirm) {
            var rowData = [ date.headline, date.headline, new Date(date.startDate, 0, 1), new Date(date.endDate, 11, 31) ];
            dataTable.addRow(rowData);
          }
        }
        var options = {
          timeline : {
            colorByRowLabel : true
          }
        };
        if (hasData) {
          chart.draw(dataTable, options);
          $timeout(function() {
            // Wait for the chart to be drawing
            $container.find('text').click(function() {
              var name = this.innerHTML;
              Firm.findByName(name).then(function(firms) {
                // console.log('got firms', firms);
                firms = GraphHelper.graphValues(firms);
                if (firms.length) {
                  var firm = firms[0];
                  $state.go('firm.summary', {
                    firmId : firm.id
                  });
                }
              });
            });
          }, 0);
        }
      }

      $scope.goToIndex = function(index) {
        $stateParams.index = index;
        $timeout(function() {
          $timeout(function() {
            makeChart(data);
          });
        }, 0);
      };

      $scope.timeline = {
        headline : 'Timeline headline',
        text : '<b>hello</b>',
        asset : {

        },
        dates : []
      };

      // Australian firms, show the timeline
      if (australian) {

        var url;
        url = 'resources/firms.json';

        $http.get(url).then(function(response) {
          data = response.data;
          if (!data.length) {
            return;
          }
          makeChart(data);
        });
      }
    });