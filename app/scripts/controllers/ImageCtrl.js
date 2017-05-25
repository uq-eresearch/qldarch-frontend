'use strict';

angular.module('qldarchApp').controller('ImageCtrl', function($stateParams, $scope, $filter, image, images, depicts, $state, File, ImageTypes) {

  $scope.image = image;

  images = $filter('orderBy')(images, function(img) {
    return (img.preferred || '');
  }, true);
  $scope.images = images;

  $scope.depicts = depicts;

  $scope.image.$type = null;
  for ( var type in ImageTypes) {
    if (image.type === type) {
      $scope.image.$type = {
        id : type,
        text : ImageTypes[type]
      };
    }
  }

  $scope.typeSelect = {
    placeholder : 'Select an Image Type',
    dropdownAutoWidth : true,
    multiple : false,
    query : function(options) {
      var data = {
        results : []
      };
      for ( var type in ImageTypes) {
        data.results.push({
          id : type,
          text : ImageTypes[type]
        });
      }
      options.callback(data);
    }
  };

  function goToPhotographs() {
    var params = {};
    if ($stateParams.archobjType === 'person') {
      params.architectId = $stateParams.archobjId;
      $state.go('architect.photographs', params);
    } else if ($stateParams.archobjType === 'firm') {
      params.firmId = $stateParams.archobjId;
      $state.go('firm.photographs', params);
    } else if ($stateParams.archobjType === 'structure') {
      params.structureId = $stateParams.archobjId;
      $state.go('structure.photographs', params);
    } else {
      $state.go('user.files.images');
    }
  }

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

  $scope.setPreferred = function(data) {
    File.preferred(data.id).then(function() {
      goToPhotographs();
    });
  };

  $scope.delete = function(data) {
    var r = window.confirm('Delete image ' + data.filename + '?');
    if (r === true) {
      File.delete(data.id).then(function() {
        goToPhotographs();
      });
    }
  };

  $scope.updateImage = function(data) {
    if (data.id) {
      File.update(data).then(function() {
        $state.go('image.view', {
          imageId : data.id
        });
      }).catch(function() {
        $state.go('user.files.images');
      });
    }
  };

  $scope.cancel = function() {
    if (image.id) {
      $state.go('image.view', {
        imageId : image.id
      });
    } else {
      $state.go('user.files.images');
    }
  };
});