'use strict';

angular.module('qldarchApp').controller(
    'FirmsTimelineCtrl',
    function($scope, firms, $stateParams, $location, $filter) {

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

      function isLetter(char) {
        return char.match(/[a-z]/i);
      }

      firms = $filter('filter')(
          firms,
          function(firm) {
            var startLetter = firm.label.substring(0, 1).toUpperCase();
            if (!isNaN(startLetter)) {
              $scope.indexes['#'] = true;
            } else if (isLetter(startLetter)) {
              $scope.indexes[startLetter] = true;
            }
            if ($stateParams.index && $stateParams.index.length === 1) {
              if (!$stateParams.index || $stateParams.index === 'null' || ($stateParams.index && firm.label.substring(0, 1) === $stateParams.index) ||
                  ($stateParams.index === '#' && !isNaN(firm.label.substring(0, 1)))) {
                return true;
              }
              return false;
            }
            return true;
          });

      firms = $filter('orderBy')(firms, function(firm) {
        return firm.label;
      });

      function frows() {
        /* globals $:false */
        return $.grep(firms, function(firm) {
          if ($stateParams.index) {
            var c0 = firm.label.charAt(0);
            return $stateParams.index === '#' ? $.isNumeric(c0) : (c0.toUpperCase() === $stateParams.index);
          } else {
            return true;
          }
        });
      }

      function makeChart(data) {
        // Setup the chart
        var container = document.getElementById('chart');
        var $container = jQuery(container);

        var paddingHeight = 50;
        var rowHeight = data.length * 41;
        var chartHeight = rowHeight + paddingHeight;
        $container.css('height', chartHeight + 'px');

        var chart = new google.visualization.Timeline(container);

        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({
          type : 'string',
          id : 'Firm'
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

        for (var i = 0; i < data.length; i++) {
          var rowData;
          if ((data.length === 1) && (data[i].start.getTime() === data[i].end.getTime())) {
            rowData = [ data[i].label, data[i].start.toUTCString(),
                new Date(data[i].start.getFullYear(), data[i].start.getMonth(), data[i].start.getDate()),
                new Date(data[i].end.getFullYear(), data[i].end.getMonth(), data[i].end.getDate() + 1) ];
          } else {
            rowData = [ data[i].label, data[i].label, new Date(data[i].start.getFullYear(), data[i].start.getMonth(), data[i].start.getDate()),
                new Date(data[i].end.getFullYear(), data[i].end.getMonth(), data[i].end.getDate()) ];
          }
          dataTable.addRow(rowData);
        }
        var options = {
          timeline : {
            colorByRowLabel : true
          }
        };
        chart.draw(dataTable, options);
      }

      $scope.goToIndex = function(index) {
        $location.search({
          index : index
        });
        $stateParams.index = index;
        makeChart(frows());
      };

      makeChart(firms);

    });