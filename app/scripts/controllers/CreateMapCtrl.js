'use strict';

angular.module('qldarchApp').controller(
    'CreateMapCtrl',
    function($scope, Entity, $state, Relationship, Structure, GraphHelper, Uris, $filter, Auth, CompoundObject) {

      var saved = false;
      // The object we are going to be posting
      $scope.map = {
        locations : [],
        $markers : [],
        $import : {
          entity : null,
          locations : null,
          numberToImport : 0
        },
        $tempLocation : {}
      };

      // Setup the map
      $scope.mapOptions = {
        zoom : 15,
        maxZoom : 16,
        mapTypeId : google.maps.MapTypeId.ROADMAP
      };

      $scope.$watch('myMap', function(myMap) {
        console.log('is showing map', $scope.isShowingMap);
        if (myMap) {
          console.log('we have a map', myMap);
          var bounds = new google.maps.LatLngBounds();
          var latlng = new google.maps.LatLng(18.547324589827422, -72.388916015625);
          bounds.extend(latlng);
          myMap.fitBounds(bounds);
        }
      });

      /*
       * ===================================================== Select2 Boxes
       * =====================================================
       */
      // Setup the entity select boxes
      $scope.architectStructureFirmTypologySelect = {
        placeholder : 'Architect, Project, Firm or Typology',
        dropdownAutoWidth : true,
        multiple : false,
        // minimumInputLength: 2,
        query : function(options) {
          Entity.findByName(options.term, false).then(
              function(entities) {
                var data = {
                  results : []
                };

                angular.forEach(entities, function(entity) {
                  if (entity.type === 'architect' || entity.type === 'buildingtypology' || entity.type === 'firm' ||
                      (entity.type === 'structure' && angular.isDefined(entity[Uris.GEO_LAT]))) {

                    var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                    if (entity.type === 'buildingtypology') {
                      label = entity.name + ' (Building typology)';
                    }
                    if (entity.type === 'structure') {
                      label = entity.name + ' (Project)';
                    }
                    data.results.push({
                      id : entity.uri,
                      uri : entity.uri,
                      text : label,
                      type : entity.type,
                      name : entity.name,
                      encodedUri : entity.encodedUri
                    });
                  }

                });
                options.callback(data);
              });
        }
      };

      /*
       * ===================================================== Import Places
       * =====================================================
       */
      function addStructuresAsLocations(structures) {
        $scope.map.$import.locations = [];
        angular.forEach(structures, function(structure) {
          if (structure.lat) {
            var location = {
              name : structure.name,
              lat : structure.lat,
              lon : structure.lon,
              uri : structure.uri,
              type : 'structure',
              $selected : true,
              asset : {
                media : 'images/icon.png',
                thumbnail : 'images/icon.png',
              }
            };
            // Add in a picture if there is one
            if (structure.picture) {
              location.asset = {
                media : Uris.FILE_ROOT + structure.picture[Uris.QA_SYSTEM_LOCATION],
                thumbnail : Uris.THUMB_ROOT + structure.picture[Uris.QA_SYSTEM_LOCATION],
              };
            }
            $scope.map.$import.locations.push(location);
          }
        });
        $scope.map.$import.numberToImport = $scope.map.$import.locations.length;
      }
      /**
       * Watches for the import entity to be changed, and fetches a list of
       * structures
       * 
       * @param {[type]}
       *          entity [description]
       * @return {[type]} [description]
       */
      $scope.$watch('map.$import.entity', function(entity) {
        if (!entity) {
          return;
        }
        // Clear the current locations
        $scope.map.$import.locations = null;

        // Find locations
        if (entity.type === 'architect') {
          Relationship.findBySubjectPredicateObject({
            predicate : 'qldarch:designedBy',
            object : entity.uri
          }).then(function(designedByRelationships) {
            var designedByStructureUris = GraphHelper.getAttributeValuesUnique(designedByRelationships, Uris.QA_SUBJECT);

            Relationship.findBySubjectPredicateObject({
              predicate : 'qldarch:workedOn',
              subject : entity.uri
            }).then(function(workedOnRelationships) {
              var workedOnStructureUris = GraphHelper.getAttributeValuesUnique(workedOnRelationships, Uris.QA_OBJECT);

              // Merge
              var structureUris = designedByStructureUris.concat(workedOnStructureUris);
              console.log(workedOnStructureUris);
              Structure.loadList(structureUris, true).then(function(structures) {
                // Convert structures to locations
                addStructuresAsLocations(structures);
              });
            });
          });

          // Look for a firm
        } else if (entity.type === 'firm') {
          var firmUri = entity.uri;
          Relationship.findBySubjectPredicateObject({
            predicate : 'qldarch:designedBy',
            object : firmUri
          }).then(function(relationships) {
            // Get all the architects
            var structureUris = GraphHelper.getAttributeValuesUnique(relationships, Uris.QA_SUBJECT);

            Structure.loadList(structureUris, true).then(function(structures) {
              var relationshipStructures = GraphHelper.graphValues(structures);

              // Get the associated firms...this is awful
              // should be all relationships or nothing!
              Structure.findByAssociatedFirmUri(firmUri).then(function(firmStructures) {
                var structures = angular.extend(relationshipStructures, firmStructures);
                structures = GraphHelper.graphValues(structures);
                addStructuresAsLocations(structures);
              });
            });
          });

          // Looking for astructure
        } else if (entity.type === 'structure') {
          Structure.load(entity.uri, true).then(function(structure) {
            addStructuresAsLocations([ structure ]);
          });

        } else if (entity.type === 'buildingtypology') {

          Structure.findByBuildingTypologyUri(entity.uri).then(function(structures) {
            structures = GraphHelper.graphValues(structures);
            addStructuresAsLocations(structures);
          });
        }

      });

      $scope.importSelectionChanged = function() {
        var selected = $filter('filter')($scope.map.$import.locations, function(location) {
          return location.$selected;
        });
        $scope.map.$import.numberToImport = selected.length;
      };
      $scope.import = function(locations) {
        locations = $filter('filter')(locations, function(location) {
          return location.$selected;
        });
        $scope.map.locations = locations.concat($scope.map.locations);
        $scope.map.$import = {
          entity : null,
          locations : []
        };
        $state.go('create.map');
      };

      /*
       * ===================================================== New Place
       * =====================================================
       */
      $scope.addLocation = function(location) {
        // Store the location
        $scope.map.locations.unshift(location);
        // Clear the entry
        $scope.map.$tempLocation = {};
        $state.go('create.map');
      };

      /*
       * ===================================================== Delete Locations
       * =====================================================
       */
      $scope.remove = function(location) {
        var index = $scope.map.locations.indexOf(location);
        $scope.map.locations.splice(index, 1);
      };

      /*
       * ===================================================== Save Map
       * =====================================================
       */
      $scope.save = function() {
        if (!saved) {
          var compoundObject = {};
          compoundObject.title = $scope.map.title;
          compoundObject.user = Auth;
          compoundObject.type = 'map';
          compoundObject.data = $scope.map;

          CompoundObject.store(compoundObject).then(function(data) {
            $state.go('content.map', {
              contentId : data.encodedUri
            });
          });
          saved = true;
        } else {
          alert('need to do put');
        }
      };

      // Setup the select boxes
      $scope.locationSelectOptions = {
        placeholder : 'Who or what is this about?',
        dropdownAutoWidth : true,
        minimumInputLength : 2,
        query : function(options) {
          Entity.findByName(options.term, false).then(function(entities) {
            var data = {
              results : []
            };
            angular.forEach(entities, function(entity) {
              data.results.push({
                id : entity.uri,
                uri : entity.uri,
                text : entity.name,
                type : entity.type,
                name : entity.name,
                encodedUri : entity.encodedUri,
                picture : entity.picture
              });
            });
            options.callback(data);
          });
        }
      };

    });