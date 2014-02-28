'use strict';

angular.module('angularApp')
    .controller('CreateTimelineCtrl', function ($scope, Entity, Uris, $stateParams, $location, $http, ENV, $filter, Relationship, GraphHelper, $q) {

        $scope.relationships = [];

        // Setup the select boxes
        $scope.entitySelectOptions = {
            placeholder: 'Who or what is this about?',
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

        $scope.$watch('entities', function (entities) {

            var returnRelationships = {};

            var promises = [];

            // We need to do a query for all the time data about this entity
            angular.forEach(entities, function (entity) {
                console.log('entity', entity);
                var promise = Relationship.findByEntityUri(entity.uri).then(function (relationships) {
                    console.log('got relationsihps', relationships);

                    var relationshipsWithDates = $filter('filter')(relationships, function (relationship) {
                        return angular.isDefined(relationship[Uris.QA_START_DATE]);
                    });
                    return Relationship.getData(relationshipsWithDates);
                });
                promises.push(promise);
            });

            $q.all(promises).then(function (relationshipsArray) {
                console.log('relationships', relationshipsArray);
                angular.forEach(relationshipsArray, function (data) {
                    var relationships = data.relationships;
                    angular.forEach(relationships, function (relationship) {
                        returnRelationships[relationship.uri] = relationship;
                    });
                });
                $scope.relationships = GraphHelper.graphValues(returnRelationships);
            });

        });

        $scope.addToTimeline = function (entity) {

        };

        $scope.orderByStart = function (relationship) {
            return relationship[Uris.QA_START_DATE] || '0';
        };


        // Setup state
        $scope.isEditing = false;
        $scope.isAddingDate = false;
        $scope.isNew = true;

        if (!$stateParams.timeline) {
            $scope.timeline = {
                dates: []
            };
        } else {
            $scope.isNew = false;
            $scope.timeline = angular.fromJson($stateParams.timeline);
            shortenUrl();
        }


        $scope.showAddDate = function () {
            $scope.date = {};
            // var startDate = String(Math.floor(1900 + (Math.random() * 200)));
            // $scope.date.startDate = startDate;
            $scope.isAddingDate = true;
        };

        /**
         * Adds a new date to the timeline
         * @param {[type]} date [description]
         */
        $scope.addDate = function (date) {
            if (!date.startDate || date.startDate.length === 0) {

            }
            // Setup the asset image
            if (date.entity) {
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
            $scope.isAddingDate = false;

            updateUrl();
        };
        $scope.removeDate = function (date) {
            var index = $scope.timeline.dates.indexOf(date);
            $scope.timeline.dates.splice(index, 1);
            if ($scope.timeline.dates.length === 0) {
                $scope.isEditing = false;
            }
            updateUrl();
        };

        $scope.hideAddDate = function () {
            $scope.isAddingDate = false;
        };

        function shortenUrl() {
            $scope.shortUrl = null;
            var absUrl = '';
            if (ENV.name === 'development') {
                absUrl += Uris.DEV_URL;
            } else {
                absUrl += Uris.PROD_URL;
            }
            absUrl += '#/create/timeline?timeline=' + encodeURIComponent(angular.toJson($scope.timeline));
            $http.post('https://www.googleapis.com/urlshortener/v1/url', {
                longUrl: absUrl
            }).then(function (response) {
                $scope.shortUrl = response.data.id;
            });
        }

        /**
         * Updates the url to include timeline data
         *
         * Updates the timeline url and gets a shortened url from google
         * @return {[type]} [description]
         */
        function updateUrl() {
            $location.search({
                timeline: angular.toJson($scope.timeline)
            });
            shortenUrl();
        }






        $scope.add = function () {

            $scope.date.asset = {
                'media': Uris.FILE_ROOT + $scope.date.entity.picture[Uris.QA_SYSTEM_LOCATION],
                'thumbnail': Uris.THUMB_ROOT + $scope.date.entity.picture[Uris.QA_SYSTEM_LOCATION],
                'caption': '<h4>' + $scope.date.entity.name + '</h4>'
            };
            $scope.dates.push($scope.date);
            console.log($scope.dates);
            $scope.date = {};
        };
    });