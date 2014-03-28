'use strict';

angular.module('angularApp')
    .controller('TimelineBuilderCtrl', function ($scope, compoundObject, Entity, Uris, Relationship, GraphHelper, Structure, $filter, $state, Auth, CompoundObject, Timeline, Expression, LayoutHelper) {
        $scope.compoundObject = compoundObject.jsonData;
        $scope.timeline = compoundObject.jsonData.data;
        if (!compoundObject.uri) {
            $scope.timeline.dates = [];
            $scope.compoundObject.user = Auth;
            $scope.compoundObject.type = 'map';
            $scope.timeline.$tempDate = {};
        }


        /*
        =====================================================
            Select2 Boxes
        =====================================================
         */
        // Setup the entity select boxes
        // Setup the entity select boxes
        $scope.architectStructureFirmSelect = {
            placeholder: 'Architect, Project or Firm',
            dropdownAutoWidth: true,
            multiple: false,
            // minimumInputLength: 2,
            query: function (options) {
                Entity.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: []
                    };

                    angular.forEach(entities, function (entity) {
                        if (entity.type === 'architect' || entity.type === 'firm' || entity.type === 'structure') {

                            var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                            if (entity.type === 'structure') {
                                label = entity.name + ' (Project)';
                            }

                            data.results.push({
                                id: entity.uri,
                                uri: entity.uri,
                                text: label,
                                type: entity.type,
                                name: entity.name,
                                encodedUri: entity.encodedUri,
                                picture: entity.picture
                            });
                        }
                    });
                    options.callback(data);
                });
            }
        };
        // Setup the entity select boxes
        $scope.architectStructureSelect = {
            placeholder: 'Architect, or Project',
            dropdownAutoWidth: true,
            multiple: false,
            // minimumInputLength: 2,
            query: function (options) {
                Entity.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: []
                    };
                    // Only show architects and structures (projects)
                    entities = $filter('filter')(GraphHelper.graphValues(entities), function (entity) {
                        return entity.type === 'architect' || entity.type === 'structure';
                    });
                    angular.forEach(entities, function (entity) {
                        if (entity.type === 'architect' || entity.type === 'structure') {

                            var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                            if (entity.type === 'structure') {
                                label = entity.name + ' (Project)';
                            }
                            data.results.push({
                                id: entity.uri,
                                uri: entity.uri,
                                text: label,
                                type: entity.type,
                                name: entity.name,
                                encodedUri: entity.encodedUri,
                                picture: entity.picture
                            });
                        }
                    });
                    options.callback(data);
                });
            }
        };

        /*
        =====================================================
            Import Dates
        =====================================================
         */
        $scope.$watch('timeline.$import.entity', function (entity) {
            if (!entity) {
                return;
            }
            $scope.timeline.$import.numberToImport = 0;

            Relationship.findByEntityUri(entity.uri).then(function (relationships) {
                var relationshipsWithDates = $filter('filter')(relationships, function (relationship) {
                    return angular.isDefined(relationship[Uris.QA_START_DATE]);
                });
                return Relationship.getData(relationshipsWithDates);
            }).then(function (data) {
                var relationships = data.relationships;
                // Convert the relationships to dates
                var importDates = Timeline.relationshipsToEvents(relationships, entity);
                angular.forEach(importDates, function (importDate) {
                    importDate.$selected = true;
                });
                $scope.timeline.$import.numberToImport = importDates.length;
                $scope.timeline.$import.dates = importDates;
            });
        });
        $scope.importSelectionChanged = function () {
            var selectedDates = $filter('filter')($scope.import.dates, function (date) {
                return date.$selected;
            });
            $scope.timeline.$import.numberToImport = selectedDates.length;
        };
        $scope.import = function (dates) {
            dates = $filter('filter')(dates, function (date) {
                return date.$selected;
            });
            $scope.timeline.dates = dates.concat($scope.timeline.dates);
            $scope.timeline.$import = {};
            $state.go('ugc.timeline.edit');
        };

        /*
        =====================================================
            New Date
        =====================================================
         */
        /**
         * Loads expressions to match entity for date
         * @param  {[type]} entity [description]
         * @return {[type]}        [description]
         */
        $scope.$watch('timeline.$tempDate.$photo.entity', function (entity) {
            if (angular.isDefined($scope.timeline.$tempDate)) {
                console.log('temp date', $scope.timeline.tempDate);
                if (angular.isDefined($scope.timeline.$tempDate.$photo)) {
                    $scope.timeline.$tempDate.$photo.expressions = null;
                }


                if (entity) {
                    if (entity.type === 'structure') {
                        Expression.findByBuildingUris([entity.uri], 'qldarch:Photograph').then(function (expressions) {
                            $scope.timeline.$tempDate.$photo.expressionRows = LayoutHelper.group(GraphHelper.graphValues(expressions), 6);
                            $scope.timeline.$tempDate.$photo.expressions = expressions;
                        });
                    } else if (entity.type === 'architect') {
                        Expression.findByArchitectUris([entity.uri], 'qldarch:Photograph').then(function (expressions) {
                            $scope.timeline.$tempDate.$photo.expressionRows = LayoutHelper.group(GraphHelper.graphValues(expressions), 6);
                            $scope.timeline.$tempDate.$photo.expressions = expressions;
                        });
                    }
                }
            } else {
                console.log('no temp date definede');
            }

        });
        /**
         * Sets an expression to be the selected asset shown for a date
         * @param {[type]} expression [description]
         * @param {[type]} date       [description]
         */
        $scope.addExpressionToDate = function (expression, date) {
            angular.forEach(date.$photo.expressions, function (expression) {
                expression.selected = false;
            });
            expression.selected = true;
            date.asset = {
                media: Uris.FILE_ROOT + expression.file[Uris.QA_SYSTEM_LOCATION],
                thumbnail: Uris.THUMB_ROOT + expression.file[Uris.QA_SYSTEM_LOCATION],
            };
        };
        $scope.addDate = function (date) {
            $scope.timeline.dates.push(date);
            $scope.timeline.$tempDate = {};
            console.log('temp date is defined', $scope.timeline.$tempDate);

            // Leave this state
            $state.go('ugc.timeline.edit');
        };

        /*
        =====================================================
            Delete Locations
        =====================================================
         */
        $scope.remove = function (date) {
            var index = $scope.timeline.dates.indexOf(date);
            $scope.timeline.dates.splice(index, 1);
        };

        /*
        =====================================================
            Save Map 
        =====================================================
         */
        $scope.save = function () {
            if (!compoundObject.uri) {
                CompoundObject.store($scope.compoundObject).then(function (data) {
                    $state.go('ugc.map', {
                        id: data.encodedUri
                    });
                });
            } else {
                CompoundObject.update(compoundObject.uri, $scope.compoundObject).then(function (data) {
                    $state.go('ugc.map', {
                        id: data.encodedUri
                    });
                });
            }
        };

        // Setup the select boxes
        $scope.locationSelectOptions = {
            placeholder: 'Who or what is this about?',
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
    });


//     'use strict';

// angular.module('angularApp')
//     .controller('CreateMapCtrl', function ($scope, Entity, $state, Relationship, Structure, GraphHelper, Uris, $filter, Auth, CompoundObject) {



//     });