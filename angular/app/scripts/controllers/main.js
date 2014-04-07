'use strict';

angular.module('angularApp')
    .controller('MainCtrl', function ($scope, $location, Uris, Entity, interviews, LayoutHelper, GraphHelper, compoundObjects, $upload, $http) {
        $scope.searchType = 'entities';
        $scope.query = '';


        $scope.architectsStart = 0;
        $scope.architectsEnd = 1;
        var architectsPerRow = 5;

        // $scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), $scope.length);
        $scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(interviews), architectsPerRow);

        $scope.nextArchitects = function () {
            $scope.architectsStart++;
            $scope.architectsEnd++;
        };
        $scope.prevArchitects = function () {
            $scope.architectsStart--;
            $scope.architectsEnd--;
        };


        $scope.compoundObjectsStart = 0;
        $scope.compoundObjectsEnd = 1;
        var compoundObjectsPerRow = 5;

        var compoundObjectsRows = LayoutHelper.group(compoundObjects, compoundObjectsPerRow);

        $scope.compoundObjectRows = compoundObjectsRows.slice(0, Math.min(4, compoundObjectsRows.length));

        $scope.nextCompoundObjects = function () {
            $scope.compoundObjectsStart++;
            $scope.compoundObjectsEnd++;
        };
        $scope.prevCompoundObjects = function () {
            $scope.compoundObjectsStart--;
            $scope.compoundObjectsEnd--;
        };

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