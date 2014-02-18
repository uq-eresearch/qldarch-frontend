'use strict';

angular.module('angularApp')
	.controller('MainCtrl', function ($scope, $location, Uris, Entity, interviews, architects, LayoutHelper, GraphHelper) {
		$scope.searchType = "entities";
		$scope.query = "";
		$scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), 6);
		$scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(architects), 6);


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
