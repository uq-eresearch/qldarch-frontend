'use strict';

angular
    .module('qldarchApp')
    .controller(
        'MapBuilderCtrl',
        function($scope, compobj, entities, CompObj, ArchObj, Uris, GraphHelper, $filter, $state, Auth, $q, leafletData) {
          /* globals _:false */
          /* globals L:false */
          $scope.compoundObject = compobj;
          $scope.map = compobj;
          $scope.map.$import = {};

          if (!compobj.id) {
            $scope.map.locations = [];
            $scope.compoundObject.user = Auth.user;
            $scope.compoundObject.type = 'map';
          }

          $scope.map.markers = [];
          $scope.map.$import.prospectiveMarkers = [];

          entities = $filter('orderBy')(entities, function(entity) {
            return entity.label;
          });

          var dataEntitySelectMap = {
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
              dataEntitySelectMap.results.push({
                id : e.id,
                text : e.label + ' (' + entitytype + ')',
                type : entitytype
              });
            }
          });

          // Setup the entity select boxes
          $scope.architectStructureFirmSelectMap = {
            placeholder : 'Architect, Project or Firm',
            dropdownAutoWidth : false,
            multiple : false,
            initSelection : true,
            data : dataEntitySelectMap
          };

          function generateProspectiveLocations() {
            if (angular.isDefined($scope.map.$import) && $scope.map.$import !== null) {
              var filteredLocations = $filter('filter')($scope.map.$import.locations, $scope.importFilter);
              filteredLocations = $filter('filter')(filteredLocations, function(location) {
                return !location.$added;
              });
              $scope.map.$import.prospectiveLocations = filteredLocations;
            }
          }

          // Import Places
          function addStructuresAsLocations(structures) {
            $scope.map.$import.locations = [];
            $scope.map.$import.filter = {
              australian : 'all'
            };
            $scope.map.$import.architects = [];
            $scope.map.$import.firms = [];
            $scope.map.$import.typologies = [];
            angular.forEach(structures, function(structure) {
              // Filter out buildings that don't have a location
              // We cant display them, so we don't show them
              if (structure.lat) {
                var location = angular.copy(structure);
                angular.extend(location, {
                  name : structure.label,
                  lat : structure.lat,
                  lon : structure.lon,
                  id : structure.id,
                  type : 'structure',
                  asset : {
                    media : 'images/icon.png',
                    thumbnail : 'images/icon.png'
                  }
                });
                // Add in a picture if there is one
                if (structure.media.length) {
                  location.asset = {
                    media : Uris.WS_MEDIA + structure.media[0].id + '?dimension=320x307',
                    thumbnail : Uris.WS_MEDIA + structure.media[0].id + '?dimension=65x65'
                  };
                }
                // Check if we already have added it
                angular.forEach($scope.map.locations, function(addedLocation) {
                  if (addedLocation.id === location.id) {
                    location.$added = true;
                  }
                });
                // Add it to the list of locations to display
                $scope.map.$import.locations.push(location);
                // Add its building typologies to the list for the filter
                if (structure.typologies) {
                  angular.forEach(structure.typologies, function(structureBuildingTypology) {
                    var found = false;
                    angular.forEach($scope.map.$import.typologies, function(filterBuildingTypology) {
                      if (structureBuildingTypology === filterBuildingTypology) {
                        found = true;
                      }
                    });
                    if (!found) {
                      $scope.map.$import.typologies.push(structureBuildingTypology);
                    }
                  });
                }
                // Find the people that built it
                var structureArchitects = $filter('filter')(
                    structure.relationships,
                    function(relationship) {
                      return (relationship.relationship === 'WorkedOn' || relationship.relationship === 'DesignedBy') &&
                          (relationship.subjectarchitect || relationship.objectarchitect);
                    });
                angular.forEach(structureArchitects, function(structureArchitect) {
                  if (structureArchitect.subjectarchitect) {
                    var subject = {
                      id : structureArchitect.subject,
                      name : structureArchitect.subjectlabel
                    };
                    if (JSON.stringify($scope.map.$import.architects).indexOf(JSON.stringify(subject)) === -1) {
                      $scope.map.$import.architects.push(subject);
                    }
                  } else if (structureArchitect.objectarchitect) {
                    var object = {
                      id : structureArchitect.object,
                      name : structureArchitect.objectlabel
                    };
                    if (JSON.stringify($scope.map.$import.architects).indexOf(JSON.stringify(object)) === -1) {
                      $scope.map.$import.architects.push(object);
                    }
                  }
                });
                // Store the firms
                var structureFirms = $filter('filter')(structure.relationships, function(relationship) {
                  return (relationship.relationship === 'WorkedOn' && (relationship.subjecttype === 'firm' || relationship.objecttype === 'firm'));
                });
                angular.forEach(structureFirms, function(structureFirm) {
                  if (structureFirm.subjecttype === 'firm') {
                    var subject = {
                      id : structureFirm.subject,
                      name : structureFirm.subjectlabel
                    };
                    if (JSON.stringify($scope.map.$import.firms).indexOf(JSON.stringify(subject)) === -1) {
                      $scope.map.$import.firms.push(subject);
                    }
                  } else if (structureFirm.objecttype === 'firm') {
                    var object = {
                      id : structureFirm.object,
                      name : structureFirm.objectlabel
                    };
                    if (JSON.stringify($scope.map.$import.firms).indexOf(JSON.stringify(object)) === -1) {
                      $scope.map.$import.firms.push(object);
                    }
                  }
                });
              }
            });
            generateProspectiveLocations();
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

            if (entity.type === 'Structure') {
              ArchObj.load(entity.id).then(function(data) {
                data.lat = data.latitude;
                data.lon = data.longitude;
                addStructuresAsLocations([ data ]);
              });
            } else {
              ArchObj.loadWithRelationshipLabels(entity.id).then(function(data) {
                data.relationships = $filter('filter')(data.relationships, function(relationship) {
                  if (relationship.subjecttype === 'structure' || relationship.objecttype === 'structure') {
                    return relationship;
                  }
                });
                var promises = [];
                angular.forEach(data.relationships, function(structure) {
                  var promise = ArchObj.load(((structure.subjecttype === 'structure') ? structure.subject : structure.object)).then(function(data) {
                    if (angular.isDefined(data.media)) {
                      data.media = $filter('filter')(data.media, function(med) {
                        return (med.preferred || (med.type === 'Photograph' || med.type === 'Portrait' || med.type === 'Image'));
                      });
                    }
                    if (angular.isDefined(data.latitude) && angular.isDefined(data.longitude)) {
                      data.lat = data.latitude;
                      data.lon = data.longitude;
                      return data;
                    }
                  }).catch(function() {
                    console.log('unable to load structure ArchObj');
                  });
                  promises.push(promise);
                });
                $q.all(promises).then(function(data) {
                  data = $filter('filter')(data, function(d) {
                    return angular.isDefined(d);
                  });
                  addStructuresAsLocations(_.uniqBy(data, 'label'));
                });
              });
            }
          });

          function addLocationsToMap(locations) {
            var locationsToAdd = [];
            // Filter out ones we have already added
            angular.forEach(locations, function(location) {
              if (!location.$added) {
                location.$added = true;
                locationsToAdd.push(location);
              }
            });
            // Add to map
            $scope.map.locations = locationsToAdd.concat($scope.map.locations);
            generateProspectiveLocations();
          }

          // Selecting Items from Import
          $scope.addAll = function() {
            var filteredLocations = $filter('filter')($scope.map.$import.locations, $scope.importFilter);
            addLocationsToMap(filteredLocations);
            $scope.map.$import.entity = null;
            $scope.map.$import.locations = null;
            $scope.isShowingFilters = false;
            $state.go('map.edit');
          };
          $scope.cancel = function() {
            $scope.map.$import.entity = null;
            $scope.map.$import.locations = null;
            $scope.map.$import.prospectiveLocations = [];
            $scope.isShowingFilters = false;
            $state.go('map.edit');
          };
          $scope.add = function(location) {
            addLocationsToMap([ location ]);
          };

          function addLocationsMarkers() {
            leafletData.getMap().then(
                function(map) {
                  var latlon = [];
                  angular.forEach($scope.map.locations, function(structure) {
                    if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
                      var mkr = [ structure.latitude, structure.longitude ];
                      var marker = L.marker(mkr)
                          .bindPopup('<a href="#/project/summary?structureId=' + structure.id + '">' + structure.label + '</a>').addTo(map);
                      $scope.map.markers.push(marker);
                      latlon.push(mkr);
                    }
                  });
                  map.fitBounds(new L.LatLngBounds(latlon));
                });
          }

          function removeLocationsMarkers() {
            leafletData.getMap().then(function(map) {
              angular.forEach($scope.map.markers, function(marker) {
                map.removeLayer(marker);
              });
            });
          }

          function removeLocationFromMap(location) {
            // Go through ones in the import list
            angular.forEach($scope.map.$import.locations, function(importLocation) {
              if (location.id === importLocation.id) {
                importLocation.$added = false;
              }
            });
            var index = $scope.map.locations.indexOf(location);
            $scope.map.locations.splice(index, 1);
            removeLocationsMarkers();
            addLocationsMarkers();
            generateProspectiveLocations();
          }

          $scope.removeAll = function() {
            angular.forEach($scope.map.$import.locations, function(importLocation) {
              importLocation.$added = false;
            });
            $scope.map.locations = [];
            removeLocationsMarkers();
            generateProspectiveLocations();
          };

          $scope.importFilter = function(location) {
            var result = true;
            var found;
            if (angular.isDefined($scope.map.$import.filter)) {
              if (angular.isDefined($scope.map.$import.filter.typology) && $scope.map.$import.filter.typology.length) {
                found = false;
                angular.forEach(GraphHelper.asArray(location.typologies), function(typology) {
                  if (typology === $scope.map.$import.filter.typology) {
                    found = true;
                  }
                });
                result = result && found;
              }
              if (angular.isDefined($scope.map.$import.filter.startYear) && $scope.map.$import.filter.startYear.length &&
                  angular.isDefined(location.completion && location.completion.length)) {
                result = result && parseInt(location.completion) >= parseInt($scope.map.$import.filter.startYear);
              }
              if (angular.isDefined($scope.map.$import.filter.endYear) && $scope.map.$import.filter.endYear.length &&
                  angular.isDefined(location.completion) && location.completion.length) {
                result = result && parseInt(location.completion) <= parseInt($scope.map.$import.filter.endYear);
              }
              // Name filter
              if ($scope.map.$import.filter.filter) {
                result = result && (location.name.toLowerCase().indexOf($scope.map.$import.filter.filter.toLowerCase()) !== -1);
              }
              // Location filter
              if ($scope.map.$import.filter.location) {
                found = false;
                if (location.location.toLowerCase().indexOf($scope.map.$import.filter.location.toLowerCase()) !== -1) {
                  found = true;
                }
                result = result && found;
              }
              // Firm filter
              if ($scope.map.$import.filter.firmId) {
                found = false;
                angular.forEach(location.relationships, function(relationship) {
                  if (relationship.relationship === 'WorkedOn') {
                    if (JSON.stringify(relationship.subject) === $scope.map.$import.filter.firmId ||
                        JSON.stringify(relationship.object) === $scope.map.$import.filter.firmId) {
                      found = true;
                    }
                  }
                });
                result = result && found;
              }
              // Australian filter
              if ($scope.map.$import.filter.australian) {
                if ($scope.map.$import.filter.australian === 'australian') {
                  result = result &&
                      ((parseFloat(location.lat) < -10) && (parseFloat(location.lat) > -45) && (parseFloat(location.lon) > 109) && (parseFloat(location.lat) < 155));
                } else if ($scope.map.$import.filter.australian === 'other') {
                  result = result &&
                      ((parseFloat(location.lat) > -10) || (parseFloat(location.lat) < -45) || (parseFloat(location.lon) < 109) || (parseFloat(location.lat) > 155));
                }
              }
              // Architect filter
              if ($scope.map.$import.filter.architectId) {
                found = false;
                angular.forEach(location.relationships, function(relationship) {
                  if (relationship.relationship === 'WorkedOn' || relationship.relationship === 'DesignedBy') {
                    if (relationship.subjectarchitect) {
                      if (JSON.stringify(relationship.subject) === $scope.map.$import.filter.architectId) {
                        found = true;
                      }
                    } else if (relationship.objectarchitect) {
                      if (JSON.stringify(relationship.object) === $scope.map.$import.filter.architectId) {
                        found = true;
                      }
                    }
                  }
                });
                result = result && found;
              }
            }
            return result;
          };

          $scope.clearImportFilters = function() {
            $scope.map.$import.filter = {};
          };

          $scope.$watch('map.$import.filter', function() {
            generateProspectiveLocations();
          }, true);

          // Delete
          $scope.remove = function(location) {
            removeLocationFromMap(location);
          };

          // Save Map
          $scope.save = function() {
            CompObj.create($scope.compoundObject).then(function(data) {
              $state.go('map.viewer', {
                id : data.id
              });
            });
          };

          function addProspectiveLocationsMarkers() {
            leafletData.getMap().then(function(map) {
              var latlon = [];
              angular.forEach($scope.map.$import.prospectiveLocations, function(structure) {
                if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
                  var mkr = [ structure.latitude, structure.longitude ];
                  map.preferCanvas = true;
                  var prospectiveMarker = L.circleMarker(mkr, {
                    color : '#3388ff'
                  }).bindPopup('<a href="#/project/summary?structureId=' + structure.id + '">' + structure.label + '</a>').addTo(map);
                  $scope.map.$import.prospectiveMarkers.push(prospectiveMarker);
                  latlon.push(mkr);
                }
              });
              map.fitBounds(new L.LatLngBounds(latlon));
            });
          }

          function removeProspectiveLocationsMarkers() {
            leafletData.getMap().then(function(map) {
              angular.forEach($scope.map.$import.prospectiveMarkers, function(marker) {
                map.removeLayer(marker);
              });
            });
          }

          $scope.$watchCollection('map.locations', function() {
            removeProspectiveLocationsMarkers();
            addLocationsMarkers();
          });

          $scope.$watchCollection('map.$import.prospectiveLocations', function() {
            removeProspectiveLocationsMarkers();
            addProspectiveLocationsMarkers();
          });

          function zoomProspectiveLocationsMarkers() {
            leafletData.getMap().then(function(map) {
              var latlon = [];
              angular.forEach($scope.map.$import.prospectiveLocations, function(structure) {
                if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
                  var mkr = [ structure.latitude, structure.longitude ];
                  latlon.push(mkr);
                }
              });
              map.fitBounds(new L.LatLngBounds(latlon));
            });
          }

          function zoomLocationsMarkers() {
            leafletData.getMap().then(function(map) {
              var latlon = [];
              angular.forEach($scope.map.locations, function(structure) {
                if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
                  var mkr = [ structure.latitude, structure.longitude ];
                  latlon.push(mkr);
                }
              });
              map.fitBounds(new L.LatLngBounds(latlon));
            });
          }

          function zoomAllMarkers() {
            leafletData.getMap().then(function(map) {
              var latlon = [];
              angular.forEach($scope.map.locations, function(structure) {
                if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
                  var mkr = [ structure.latitude, structure.longitude ];
                  latlon.push(mkr);
                }
              });
              angular.forEach($scope.map.$import.prospectiveLocations, function(structure) {
                if (angular.isDefined(structure.longitude) && angular.isDefined(structure.longitude)) {
                  var mkr = [ structure.latitude, structure.longitude ];
                  latlon.push(mkr);
                }
              });
              map.fitBounds(new L.LatLngBounds(latlon));
            });
          }

          $scope.$watch('zoom', function(zoom) {
            if (zoom) {
              if (zoom === 'prospective') {
                zoomProspectiveLocationsMarkers();
              } else if (zoom === 'all') {
                zoomAllMarkers();
              } else if (zoom === 'added') {
                zoomLocationsMarkers();
              }
            }
          });

        });