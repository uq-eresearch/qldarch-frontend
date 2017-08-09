'use strict';

angular.module('qldarchApp').controller('MainCtrl', function($scope, $sce, Uris, interviews, LayoutHelper, GraphHelper, compoundObjects) {
  $scope.slidesInterval = 5000;
  $scope.slides = [ {
    image : '../images/header_1280x165.jpg',
    caption : '<h3>Explore Queensland Architecture</h3>'
  }, {
    image : Uris.QLDARCH_UI + 'videos/poster.png',
    caption : '<h4>Search for architects, firms and projects or use the interactive tools</h4>'
  } ];

  $scope.searchType = 'entities';
  $scope.query = '';

  $scope.architectsStart = 0;
  $scope.architectsEnd = 1;
  var architectsPerRow = 5;

  $scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(interviews), architectsPerRow);

  $scope.nextArchitects = function() {
    $scope.architectsStart++;
    $scope.architectsEnd++;
  };
  $scope.prevArchitects = function() {
    $scope.architectsStart--;
    $scope.architectsEnd--;
  };

  $scope.compoundObjectsStart = 0;
  $scope.compoundObjectsEnd = 1;
  var compoundObjectsPerRow = 5;

  var compoundObjectsRows = LayoutHelper.group(compoundObjects, compoundObjectsPerRow);

  $scope.compoundObjectRows = compoundObjectsRows.slice(0, Math.max((compoundObjects.length / compoundObjectsPerRow), compoundObjectsRows.length));

  $scope.nextCompoundObjects = function() {
    $scope.compoundObjectsStart++;
    $scope.compoundObjectsEnd++;
  };
  $scope.prevCompoundObjects = function() {
    $scope.compoundObjectsStart--;
    $scope.compoundObjectsEnd--;
  };

  $scope.trustedUrl = function(url) {
    return $sce.trustAsResourceUrl(url);
  };

});