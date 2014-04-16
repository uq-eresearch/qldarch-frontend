'use strict';

angular.module('angularApp')
    .controller('ImageCtrl', function ($scope, image, images, depicts, $state, Expression) {

        $scope.image = image;
        $scope.images = images;
        console.log('images', images);
        $scope.depicts = depicts;

        // Work out index
        angular.forEach($scope.images, function (myImage, myIndex) {
            if (myImage.uri === $scope.image.uri) {
                $scope.index = myIndex;
            }
        });

        $scope.next = function () {
            // Go to the next one
            var nextImageIndex = ($scope.index + 1) % $scope.images.length;
            var nextImage = $scope.images[nextImageIndex];
            $state.go('image.view', {
                imageId: nextImage.encodedUri
            });
        };
        $scope.prev = function () {
            // Go to the previous one
            var prevImageIndex = ($scope.index - 1) % $scope.images.length;
            var prevImage = $scope.images[prevImageIndex];
            $state.go('image.view', {
                imageId: prevImage.encodedUri
            });
        };

        $scope.delete = function (photograph) {
            Expression.delete(photograph.uri, photograph).then(function () {
                $state.go(photograph.$parentState, photograph.$parentStateParams);
            });
        };

    });