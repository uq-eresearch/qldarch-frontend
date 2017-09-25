'use strict';

angular.module('qldarchApp').controller('SearchCtrl', function($scope, searchresult) {

  $scope.itemsPerPage = 20;
  $scope.currentPage = 1;
  $scope.maxSize = 15;
  $scope.query = searchresult.query;
  $scope.totalItems = searchresult.totalItems;

  function scrollToTop() {
    jQuery('html, body').animate({
      scrollTop : 0
    }, 500);
  }

  $scope.pageChanged = function() {
    var currentPageStart = (($scope.currentPage - 1) * $scope.itemsPerPage);
    var currentPageEnd = $scope.currentPage * $scope.itemsPerPage;
    $scope.results = searchresult.data.slice(currentPageStart, currentPageEnd);
    scrollToTop();
  };

  $scope.pageChanged();

});