'use strict';

angular.module('angularApp')
    .controller('CreateTimelineCtrl', function ($scope, Entity, Uris, $stateParams, $location, $http, ENV, $filter, Relationship, GraphHelper, $q, Timeline, $state) {


        $scope.relationships = [];
        $scope.timeline = {
            dates: []
        };
        $scope.date = {};

        $scope.DEFAULT_EVENT_DISPLAY_COUNT = 4;
        $scope.eventDisplayCount = $scope.DEFAULT_EVENT_DISPLAY_COUNT;
        $scope.showAllEvents = function () {
            $scope.eventDisplayCount = $scope.timeline.dates.length;
        };

        $scope.entities = [];

        // Setup the select boxes
        $scope.importEventSelect = {
            placeholder: 'Architect, Building or Firm',
            dropdownAutoWidth: true,
            multiple: true,
            // minimumInputLength: 2,
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

        $scope.relatedSelect = {
            placeholder: 'Architect, Building or Firm',
            dropdownAutoWidth: true,
            multiple: false,
            // minimumInputLength: 2,
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

        if ($stateParams.uris) {
            var uris = angular.fromJson($stateParams.uris);
            // Get the entities for these uris
            Entity.loadList(uris, true).then(function (loadedEntities) {
                var entities = [];
                angular.forEach(loadedEntities, function (loadedEntity) {
                    var entity = {
                        id: loadedEntity.uri,
                        uri: loadedEntity.uri,
                        text: loadedEntity.name,
                        type: loadedEntity.type,
                        name: loadedEntity.name,
                        encodedUri: loadedEntity.encodedUri,
                        picture: loadedEntity.picture
                    };
                    entities.push(entity);
                });
                $scope.entities = entities;
                $scope.importEvents(entities);
            });
        }

        $scope.importEvents = function (entities) {
            var promises = [];

            // We need to do a query for all the time data about this entity
            angular.forEach(entities, function (entity) {
                // Get the relationships
                var promise = Relationship.findByEntityUri(entity.uri).then(function (relationships) {
                    var relationshipsWithDates = $filter('filter')(relationships, function (relationship) {
                        return angular.isDefined(relationship[Uris.QA_START_DATE]);
                    });
                    return Relationship.getData(relationshipsWithDates);
                });
                promises.push(promise);
            });

            $q.all(promises).then(function (datas) {
                var dates = [];
                angular.forEach(datas, function (data) {
                    var relationships = data.relationships;
                    var newDates = Timeline.relationshipsToEvents(relationships);
                    dates = dates.concat(newDates);
                });
                console.log('timeline', $scope.timeline);
                $scope.timeline.dates = $scope.timeline.dates.concat(dates);
                console.log('timeline', $scope.timeline);
            });

            $state.go('create.timeline');

            $scope.entities = [];
            $scope.isImportingEvents = false;
        };

        /**
         * Adds a new date to the timeline
         * @param {[type]} date [description]
         */
        $scope.addDate = function (date) {
            if (!date.startDate || date.startDate.length === 0) {
                console.log('No date');
            }

            // Setup the asset image
            if (date.entity) {
                console.log('has entity', date.entity);
                date.asset = {
                    media: 'images/icon.png',
                    thumbnail: 'images/icon.png',
                    caption: '<h4><a href="#/' + date.entity.type + '/' + date.entity.encodedUri + '">' + date.entity.name + '</a></h4>'
                };
                if (date.entity.picture) {
                    date.asset.media = Uris.FILE_ROOT + date.entity.picture[Uris.QA_SYSTEM_LOCATION];
                    date.asset.thumbnail = Uris.THUMB_ROOT + date.entity.picture[Uris.QA_SYSTEM_LOCATION];
                }
            }
            $scope.timeline.dates.push(date);
            $scope.date = {};

            // Leave this state
            $state.go('create.timeline');
        };
        $scope.removeDate = function (date) {
            var index = $scope.timeline.dates.indexOf(date);
            $scope.timeline.dates.splice(index, 1);
        };

        // Check if we have entities in the url
        // if ($location.search('uris')) {
        //     console.log('$location search', $location.search('uris'));
        // }

        $scope.orderByStart = function (date) {
            return date.startDate || '0';
        };


        // // Setup state
        // $scope.isEditing = false;
        // $scope.isAddingDate = false;
        // $scope.isNew = true;

        // if (!$stateParams.timeline) {
        //     $scope.timeline = {
        //         dates: []
        //     };
        // } else {
        //     $scope.isNew = false;
        //     $scope.timeline = angular.fromJson($stateParams.timeline);
        //     shortenUrl();
        // }


        // $scope.showAddDate = function () {
        //     $scope.date = {};
        //     // var startDate = String(Math.floor(1900 + (Math.random() * 200)));
        //     // $scope.date.startDate = startDate;
        //     $scope.isAddingDate = true;
        // };

        // /**
        //  * Adds a new date to the timeline
        //  * @param {[type]} date [description]
        //  */
        // $scope.addDate = function (date) {
        //     if (!date.startDate || date.startDate.length === 0) {

        //     }
        //     // Setup the asset image
        //     if (date.entity) {
        //         date.asset = {
        //             media: 'images/icon.png',
        //             thumbnail: 'images/icon.png',
        //             caption: '<h4><a href="#/' + date.entity.type + '/' + date.entity.encodedUri + '">' + date.entity.name + '</a></h4>'
        //         };
        //         if (date.entity.picture) {
        //             date.asset.media = Uris.FILE_ROOT + date.entity.picture[Uris.QA_SYSTEM_LOCATION];
        //             date.asset.thumbnail = Uris.THUMB_ROOT + date.entity.picture[Uris.QA_SYSTEM_LOCATION];
        //         }
        //     }
        //     $scope.timeline.dates.push(date);
        //     $scope.isAddingDate = false;

        //     updateUrl();
        // };
        // $scope.removeDate = function (date) {
        //     var index = $scope.timeline.dates.indexOf(date);
        //     $scope.timeline.dates.splice(index, 1);
        //     if ($scope.timeline.dates.length === 0) {
        //         $scope.isEditing = false;
        //     }
        //     updateUrl();
        // };

        // $scope.hideAddDate = function () {
        //     $scope.isAddingDate = false;
        // };

        // function shortenUrl() {
        //     $scope.shortUrl = null;
        //     var absUrl = '';
        //     if (ENV.name === 'development') {
        //         absUrl += Uris.DEV_URL;
        //     } else {
        //         absUrl += Uris.PROD_URL;
        //     }
        //     absUrl += '#/create/timeline?timeline=' + encodeURIComponent(angular.toJson($scope.timeline));
        //     $http.post('https://www.googleapis.com/urlshortener/v1/url', {
        //         longUrl: absUrl
        //     }).then(function (response) {
        //         $scope.shortUrl = response.data.id;
        //     });
        // }

        // /**
        //  * Updates the url to include timeline data
        //  *
        //  * Updates the timeline url and gets a shortened url from google
        //  * @return {[type]} [description]
        //  */
        // function updateUrl() {
        //     $location.search({
        //         timeline: angular.toJson($scope.timeline)
        //     });
        //     shortenUrl();
        // }






        // $scope.add = function () {

        //     $scope.date.asset = {
        //         'media': Uris.FILE_ROOT + $scope.date.entity.picture[Uris.QA_SYSTEM_LOCATION],
        //         'thumbnail': Uris.THUMB_ROOT + $scope.date.entity.picture[Uris.QA_SYSTEM_LOCATION],
        //         'caption': '<h4>' + $scope.date.entity.name + '</h4>'
        //     };
        //     $scope.dates.push($scope.date);
        //     console.log($scope.dates);
        //     $scope.date = {};
        // };
    });