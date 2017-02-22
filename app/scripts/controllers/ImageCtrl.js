'use strict';

angular.module('qldarchApp').controller('ImageCtrl', function ($stateParams, $scope, image, images, depicts, $state/*, Expression, Entity, Uris, Auth*/) {

  $scope.image = image;
  $scope.images = images;
  $scope.depicts = depicts;

  // Setup creator and rights
//  if (image[Uris.DCT_CREATOR] === Auth.email) {
//    $scope.image.$creator = 'creator';
//  } else {
//    $scope.image.$creator = 'other';
//  }
//
//  if (image[Uris.DCT_RIGHTS] === Auth.email) {
//    $scope.image.$rights = 'owner';
//  } else if (image[Uris.DCT_RIGHTS] && image[Uris.DCT_RIGHTS].indexOf('permission') !== -1) {
//    $scope.image.$rights = 'permission';
//  } else if (image[Uris.DCT_RIGHTS] && image[Uris.DCT_RIGHTS].indexOf('orphaned') !== -1) {
//    $scope.image.$rights = 'orphaned';
//  }


  // Work out index
  angular.forEach($scope.images, function (myImage, myIndex) {
    if (myImage.id === $scope.image.id) {
      $scope.index = myIndex;
    }
  });

  $scope.next = function () {
    // Go to the next one
    var nextImageIndex = ($scope.index + 1) % $scope.images.length;
    var nextImage = $scope.images[nextImageIndex];
    $state.go('image.view', {
      imageId: nextImage.id
    });
  };
  $scope.prev = function () {
    // Go to the previous one
    var prevImageIndex = ($scope.index - 1) % $scope.images.length;
    var prevImage = $scope.images[prevImageIndex];
    $state.go('image.view', {
      imageId: prevImage.id
    });
  };

//  $scope.setDefault = function (image) {        	
//    depicts[Uris.QA_PREFERRED_IMAGE] = image.uri;
//
//    Entity.update(depicts.uri, depicts).then(function () {
//      console.log('saved');
//
//      angular.forEach($scope.images, function (galleryImage) {
//        if (galleryImage.uri === image.uri) {
//          angular.copy(image, galleryImage);
//        }
//      });
//
//      Entity.clearAll();
//      depicts.picture = image.file;
//    });
//  };
//
//  $scope.delete = function (photograph) {
//    Expression.delete(photograph.uri, photograph).then(function () {
//      $state.go(photograph.$parentState, photograph.$parentStateParams);
//    });
//  };
//
//  $scope.save = function (image) {
//    console.log('saving');
//    Expression.update(image.uri, image).then(function () {
//      console.log('saved');
//
//      // Update the image in the gallery
//      // otherwise the gallery would have a stale copy of the data
//      angular.forEach($scope.images, function (galleryImage) {
//        if (galleryImage.uri === image.uri) {
//          angular.copy(image, galleryImage);
//        }
//      });
//      $state.go(image.$stateTo('view'), image.$stateParams);
//    });
//  };

});