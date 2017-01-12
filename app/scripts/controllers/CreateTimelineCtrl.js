'use strict';

angular.module('qldarchApp').controller(
    'CreateTimelineCtrl',
    function($scope, Entity, Uris, $stateParams, $location, $http, $filter, Relationship, GraphHelper, $q, Timeline, $state, Expression,
        LayoutHelper, Auth, CompoundObject) {

      var DEFAULT_IMPORT = {
        entity : null,
        dates : null
      };
      var saved = false;
      $scope.relationships = [];
      $scope.timeline = {
        dates : []
      };
      if (Auth.auth) {
        $scope.timeline.subtitle = 'Created by ' + Auth.email;
      }
      $scope.date = {
        photo : {}
      };
      $scope.import = angular.copy(DEFAULT_IMPORT);

      $scope.importEventsEntity = null;

      // Setup the entity select boxes
      $scope.architectStructureFirmSelect = {
        placeholder : 'Architect, Project or Firm',
        dropdownAutoWidth : true,
        multiple : false,
        // minimumInputLength: 2,
        query : function(options) {
          Entity.findByName(options.term, false).then(function(entities) {
            var data = {
              results : []
            };

            angular.forEach(entities, function(entity) {
              if (entity.type === 'architect' || entity.type === 'firm' || entity.type === 'structure') {

                var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                if (entity.type === 'structure') {
                  label = entity.name + ' (Project)';
                }

                data.results.push({
                  id : entity.uri,
                  uri : entity.uri,
                  text : label,
                  type : entity.type,
                  name : entity.name,
                  encodedUri : entity.encodedUri,
                  picture : entity.picture
                });
              }
            });
            options.callback(data);
          });
        }
      };
      // Setup the entity select boxes
      $scope.architectStructureSelect = {
        placeholder : 'Architect, or Project',
        dropdownAutoWidth : true,
        multiple : false,
        // minimumInputLength: 2,
        query : function(options) {
          Entity.findByName(options.term, false).then(function(entities) {
            var data = {
              results : []
            };
            // Only show architects and structures (projects)
            entities = $filter('filter')(GraphHelper.graphValues(entities), function(entity) {
              return entity.type === 'architect' || entity.type === 'structure';
            });
            angular.forEach(entities, function(entity) {
              if (entity.type === 'architect' || entity.type === 'structure') {

                var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                if (entity.type === 'structure') {
                  label = entity.name + ' (Project)';
                }
                data.results.push({
                  id : entity.uri,
                  uri : entity.uri,
                  text : label,
                  type : entity.type,
                  name : entity.name,
                  encodedUri : entity.encodedUri,
                  picture : entity.picture
                });
              }
            });
            options.callback(data);
          });
        }
      };

      if ($stateParams.uris) {
        var uris = angular.fromJson($stateParams.uris);
        // Get the entities for these uris
        Entity.loadList(uris, true).then(function(loadedEntities) {
          var entities = [];
          angular.forEach(loadedEntities, function(loadedEntity) {
            var entity = {
              id : loadedEntity.uri,
              uri : loadedEntity.uri,
              text : loadedEntity.name,
              type : loadedEntity.type,
              name : loadedEntity.name,
              encodedUri : loadedEntity.encodedUri,
              picture : loadedEntity.picture
            };
            entities.push(entity);
          });
          $scope.entities = entities;
          $scope.importEvents(entities);
        });
      }

      /*
       * ===================================================== New Date
       * =====================================================
       */
      /**
       * Loads expressions to match entity for date
       * 
       * @param {[type]}
       *          entity [description]
       * @return {[type]} [description]
       */
      $scope.$watch('date.photo.entity', function(entity) {
        if (entity) {
          if (entity.type === 'structure') {
            Expression.findByBuildingUris([ entity.uri ], 'qldarch:Photograph').then(function(expressions) {
              $scope.date.photo.expressionRows = LayoutHelper.group(GraphHelper.graphValues(expressions), 6);
              $scope.date.photo.expressions = expressions;
            });
          } else if (entity.type === 'architect') {
            Expression.findByArchitectUris([ entity.uri ], 'qldarch:Photograph').then(function(expressions) {
              $scope.date.photo.expressionRows = LayoutHelper.group(GraphHelper.graphValues(expressions), 6);
              $scope.date.photo.expressions = expressions;
            });
          }
        }
      });
      /**
       * Sets an expression to be the selected asset shown for a date
       * 
       * @param {[type]}
       *          expression [description]
       * @param {[type]}
       *          date [description]
       */
      $scope.addExpressionToDate = function(expression, date) {
        angular.forEach(date.photo.expressions, function(expression) {
          expression.selected = false;
        });
        expression.selected = true;
        date.asset = {
          media : Uris.FILE_ROOT + expression.file[Uris.QA_SYSTEM_LOCATION],
          thumbnail : Uris.THUMB_ROOT + expression.file[Uris.QA_SYSTEM_LOCATION],
        };
      };
      $scope.addDate = function(date) {
        $scope.timeline.dates.push(date);
        $scope.date = {
          photo : {}
        };

        // Leave this state
        $state.go('create.timeline');
      };

      /*
       * ===================================================== Import Dates
       * =====================================================
       */
      $scope.$watch('import.entity', function(entity) {
        if (!entity) {
          return;
        }
        $scope.import.numberToImport = 0;

        Relationship.findByEntityUri(entity.uri).then(function(relationships) {
          var relationshipsWithDates = $filter('filter')(relationships, function(relationship) {
            return angular.isDefined(relationship[Uris.QA_START_DATE]);
          });
          return Relationship.getData(relationshipsWithDates);
        }).then(function(data) {
          var relationships = data.relationships;
          // Convert the relationships to dates
          var importDates = Timeline.relationshipsToEvents(relationships, entity);
          // Set all the dates as selected
          angular.forEach(importDates, function(importDate) {
            importDate.$selected = true;
          });
          $scope.import.numberToImport = importDates.length;
          $scope.import.dates = importDates;
        });
      });
      $scope.importSelectionChanged = function() {
        var selectedDates = $filter('filter')($scope.import.dates, function(date) {
          return date.$selected;
        });
        $scope.import.numberToImport = selectedDates.length;
      };
      $scope.importEvents = function(dates) {
        dates = $filter('filter')(dates, function(date) {
          return date.$selected;
        });
        $scope.timeline.dates = $scope.timeline.dates.concat(dates);
        $scope.import = angular.copy(DEFAULT_IMPORT);
        $state.go('create.timeline');
      };

      /*
       * ===================================================== Delete dates
       * =====================================================
       */
      $scope.removeDate = function(date) {
        var index = $scope.timeline.dates.indexOf(date);
        $scope.timeline.dates.splice(index, 1);
      };

      /*
       * ===================================================== Order dates
       * =====================================================
       */
      $scope.orderByStart = function(date) {
        return date.startDate || '0';
      };

      /*
       * ===================================================== Save timeline
       * =====================================================
       */
      $scope.saveTimeline = function(timeline) {
        if (!saved) {
          var compoundObject = {};
          compoundObject.title = timeline.headline;
          compoundObject.user = Auth;
          compoundObject.type = 'timeline';
          compoundObject.data = timeline;

          CompoundObject.store(compoundObject).then(function(data) {
            console.log('response', data);
            $state.go('content.timeline', {
              contentId : data.encodedUri
            });
          });
          saved = true;
        } else {
          alert('need to do put');
        }
      };

    });