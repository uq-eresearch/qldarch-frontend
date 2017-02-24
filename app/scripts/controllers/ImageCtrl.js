'use strict';

angular.module('qldarchApp').controller('ImageCtrl', function($stateParams, $scope, image, images, depicts, $state) {

  $scope.image = image;
  $scope.images = images;
  $scope.depicts = depicts;

  // Work out index
  angular.forEach($scope.images, function(myImage, myIndex) {
    if (myImage.id === $scope.image.id) {
      $scope.index = myIndex;
    }
  });

  $scope.next = function() {
    // Go to the next one
    var nextImageIndex = ($scope.index + 1) % $scope.images.length;
    var nextImage = $scope.images[nextImageIndex];
    $state.go('image.view', {
      imageId : nextImage.id
    });
  };
  $scope.prev = function() {
    // Go to the previous one
    var prevImageIndex = ($scope.index - 1) % $scope.images.length;
    var prevImage = $scope.images[prevImageIndex];
    $state.go('image.view', {
      imageId : prevImage.id
    });
  };

});