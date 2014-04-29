'use strict';

angular.module('angularApp')
    .controller('ArchitectCtrl', function ($scope, types, architect, interviews, $http, $state, Uris, Entity, GraphHelper) {

        $scope.architect = architect;
        $scope.interviews = interviews;

        function goToTypePage(typeUri) {
            if (typeUri === Uris.QA_ARCHITECT_TYPE) {
                $state.go('architect.summary', {
                    architectId: architect.encodedUri
                });
            } else if (typeUri === Uris.QA_FIRM_TYPE) {
                $state.go('firm.summary', {
                    firmId: architect.encodedUri
                });
            } else if (typeUri === Uris.QA_STRUCTURE_TYPE) {
                $state.go('structure.summary', {
                    structureId: architect.encodedUri
                });
            } else {
                $state.go('other.summary', {
                    otherId: architect.encodedUri
                });
            }
        }
        $scope.updateArchitect = function (architect) {
            if (architect.uri) {
                // PUT
                Entity.update(architect.uri, architect).
                catch (function (error) {
                    alert('Failed to save');
                    console.log('Failed to save', error);
                    $state.go('architect.summary.edit', {
                        architectId: architect.encodedUri
                    });
                });
                goToTypePage($scope.architect[Uris.RDF_TYPE]);
            } else {
                // POST
                console.log('architect', architect);

                Entity.create(architect, Uris.QA_ARCHITECT_TYPE).then(function () {
                    goToTypePage($scope.architect[Uris.RDF_TYPE]);
                });
            }
        };



        $scope.cancel = function () {
            if (architect.uri) {
                $state.go('architect.summary');
            } else {
                $state.go('architects.queensland');
            }
        };

        /**
         * ======================================================
         *
         * Select Box for Types
         *
         * ======================================================
         */
        $scope.architect.$type = null;
        angular.forEach(types, function (type) {
            if (type.uri === Uris.QA_ARCHITECT_TYPE) {
                $scope.architect.$type = {
                    id: type.uri,
                    uri: type.uri,
                    text: type[Uris.QA_LABEL],
                    name: type[Uris.QA_LABEL],
                    encodedUri: type.encodedUri,
                };
            }
        });
        $scope.$watch('architect.$type', function (type, oldType) {
            // Delete all typologies on the structure
            if (type) {
                $scope.architect[Uris.RDF_TYPE] = type.uri;
            }
        });
        $scope.typeSelect = {
            placeholder: 'Select a Type',
            dropdownAutoWidth: true,
            multiple: false,
            query: function (options) {
                var data = {
                    results: []
                };
                angular.forEach(types, function (type) {
                    if (type.uri !== Uris.QA_BUILDING_TYPOLOGY && type[Uris.QA_LABEL].toLowerCase().indexOf(options.term.toLowerCase()) !== -1) {
                        data.results.push({
                            id: type.uri,
                            uri: type.uri,
                            text: type[Uris.QA_LABEL],
                            name: type[Uris.QA_LABEL],
                            encodedUri: type.encodedUri,
                        });
                    }
                });
                options.callback(data);
            }
        };


        // <div infinite-scroll="addMoreExchanges()" class="interview-exchanges" style="margin-top: 24px;">
        //         <div ng-repeat="exchange in interview.transcript.exchanges | filter:{'transcript': transcriptSearchInput} | filter:timeFilter | limitTo:exchangeDisplayCount"

        // $scope.firms = GraphHelper.graphValues(firms);
        // $scope.firmRows = LayoutHelper.group(GraphHelper.graphValues(firms), 6);
        // $scope.interviewCount = GraphHelper.graphValues(interviews).length;
        // $scope.mentionsCount = GraphHelper.graphValues(mentions).length;
        // $scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), 6);

        // $scope.mentionedInterviewRows = LayoutHelper.group(GraphHelper.graphValues(mentions), 6);
        // $scope.structureRows = LayoutHelper.group(GraphHelper.graphValues(structures), 3);
        //
        // $scope.interviewType = 'featured';
        // if($scope.interviewRows.length == 0 && $scope.mentionedInterviewRows.length > 0) {
        // 	$scope.interviewType = 'mentioned';
        // }



        // $scope.explore = function() {
        // 	$location.path("/explore");
        // 	$location.search("uri", GraphHelper.encodeUriString($scope.architect.uri));
        // }

        // $scope.myMarkers = [];
        // var position = new google.maps.LatLng(-27.47101069974658, 153.02344889903907);

        // $scope.mapOptions = {
        // 	center: position,
        // 	zoom: 15,
        // 	mapTypeId: google.maps.MapTypeId.ROADMAP
        // };
        // $scope.mapEvents = {

        // };

        // $scope.refreshMap = function() {
        // 	console.log("map tab clicked");
        // 	google.maps.event.trigger($scope.myMap, 'resize');
        // 	$scope.myMap.setCenter(position);

        // 	angular.forEach(structures, function(structure) {
        // 		console.log("structure", structure);
        // 		if(angular.isDefined(structure.lat)) {
        // 			var marker = new google.maps.Marker({
        // 				position: new google.maps.LatLng(structure.lat, structure.lon),
        // 				title: structure.name,
        // 				map: $scope.myMap
        // 			});
        // 		}
        // 	});
        //			if(!marker) {
        //				marker = new google.maps.Marker({
        //					position: position,
        //					title: $scope.structure.name,
        //					map: $scope.myMap
        //				});
        //			}
        // }


    });