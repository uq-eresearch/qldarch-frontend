'use strict';

angular.module('angularApp')
    .controller('MainCtrl', function ($scope, $location, Uris, Entity, interviews, architects, LayoutHelper, GraphHelper, compoundObjects) {
        $scope.searchType = 'entities';
        $scope.query = '';


        $scope.architectsStart = 0;
        $scope.architectsEnd = 1;
        var architectsPerRow = 5;

        // $scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), $scope.length);
        $scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(architects), architectsPerRow);

        $scope.nextArchitects = function () {
            $scope.architectsStart++;
            $scope.architectsEnd++;
        };
        $scope.prevArchitects = function () {
            $scope.architectsStart--;
            $scope.architectsEnd--;
        };

        $scope.compoundObjectRows = LayoutHelper.group(compoundObjects, 5);
        console.log('compoundObjects', compoundObjects, $scope.compoundObjectRows);
        // $scope.end = $scope.index + $scope.length;
        // $scope.prevArchitects = function () {
        //     $scope.index = Math.max($scope.index - $scope.length, 0);
        //     $scope.end = ($scope.index + $scope.length) % $scope.length;
        // };
        // $scope.nextArchitects = function () {
        //     $scope.index = Math.max($scope.index + $scope.length, $scope.architectRows.length);
        //     $scope.end = ($scope.index + $scope.length) % $scope.length;
        // };
        //		$scope.search = function(query) {
        //			console.log("searching",query, $scope.searchType);
        //			if($scope.searchType == "entities") {
        //				if(query && query.length) {
        //					// look up an entitiy
        //					Entity.findByName(query).then(function (entities) {
        //						console.log(entities);
        //						$scope.entities = entities;
        //					});
        //				}
        //			} else if($scope.searchType == "articles") {
        //				if(query && query.length) {
        //					$location.url("/search?query=" + query);
        //				}
        //			}
        //		}

    });