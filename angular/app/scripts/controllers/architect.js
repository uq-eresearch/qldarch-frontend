'use strict';

angular.module('angularApp')
    .controller('ArchitectCtrl', function ($scope, architect, interviews, $http, $state, Uris, Entity) {

        $scope.architect = architect;
        $scope.interviews = interviews;

        $scope.updateArchitect = function (architect) {
            Entity.update(architect.uri, architect).
            catch (function (error) {
                alert('Failed to save');
                console.log('Failed to save', error);
                $state.go('architect.summary.edit', {
                    architectId: architect.encodedUri
                });
            });

            $state.go('architect.summary', {
                architectId: architect.encodedUri
            });
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