'use strict';

angular.module('qldarchApp').controller('TimelineBuilderCtrl',
    function($scope, compobj, CompObj, entities, ArchObj, Uris, $filter, $state, Auth, Timeline) {

      $scope.compoundObject = compobj;
      $scope.timeline = compobj;
      if (!compobj.id) {
        $scope.timeline.dates = [];
        $scope.compoundObject.user = Auth.user;
        $scope.compoundObject.type = 'timeline';
        $scope.timeline.$tempDate = {};
      }

      // Select2 Boxes
      entities = $filter('orderBy')(entities, function(entity) {
        return entity.label;
      });

      var dataEntitySelectTimeLine = {
        results : []
      };

      angular.forEach(entities, function(e) {
        if (e.label && !(/\s/.test(e.label.substring(0, 1)))) {
          var entitytype = 'unknown';
          if (e.hasOwnProperty('type')) {
            entitytype = e.type.charAt(0).toUpperCase() + e.type.slice(1);
          } else if (e.hasOwnProperty('firstname') || e.hasOwnProperty('lastname')) {
            entitytype = 'Person';
          } else if (e.hasOwnProperty('lat') || e.hasOwnProperty('lng')) {
            entitytype = 'Structure';
          }
          dataEntitySelectTimeLine.results.push({
            id : e.id,
            text : e.label + ' (' + entitytype + ')'
          });
        }
      });

      // Setup the entity select boxes
      $scope.architectStructureFirmSelectTimeLine = {
        placeholder : 'Architect, Project or Firm',
        dropdownAutoWidth : false,
        multiple : false,
        initSelection : true,
        data : dataEntitySelectTimeLine
      };

      // Import Dates
      $scope.$watch('timeline.$import.entity', function(entity) {
        if (!entity) {
          return;
        }
        $scope.timeline.$import.numberToImport = 0;

        ArchObj.loadWithRelationshipLabels(entity.id).then(function(data) {
          var relationships = $filter('filter')(data.relationships, function(relationship) {
            return (relationship.fromyear || relationship.untilyear || relationship.objectcompletion);
          });
          // Convert the relationships to dates
          var importDates = Timeline.relationshipsToEvents(relationships, entity.id);
          importDates = $filter('orderBy')(importDates, function(importDate) {
            return importDate.startDate;
          });
          angular.forEach(importDates, function(importDate) {
            importDate.$selected = true;
          });
          $scope.timeline.$import.numberToImport = importDates.length;
          $scope.timeline.$import.dates = importDates;
        });
      });

      $scope.importSelectionChanged = function() {
        var selectedDates = $filter('filter')($scope.import.dates, function(date) {
          return date.$selected;
        });
        $scope.timeline.$import.numberToImport = selectedDates.length;
      };

      $scope.import = function(dates) {
        dates = $filter('filter')(dates, function(date) {
          return date.$selected;
        });
        $scope.timeline.dates = dates.concat($scope.timeline.dates);
        $scope.timeline.$import = {};
        $state.go('ugc.timeline.edit');
      };

      // Delete date
      $scope.remove = function(date) {
        var index = $scope.timeline.dates.indexOf(date);
        $scope.timeline.dates.splice(index, 1);
      };

      $scope.removeAll = function() {
        $scope.timeline.dates = [];
      };

      // Create timeline
      $scope.save = function() {
        CompObj.create($scope.compoundObject).then(function(data) {
          $state.go('ugc.timeline', {
            id : data.id
          });
        });
      };
    });