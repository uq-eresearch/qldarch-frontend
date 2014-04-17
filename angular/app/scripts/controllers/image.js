'use strict';

angular.module('angularApp')
    .controller('ImageCtrl', function ($scope, image, images, depicts, $state, Expression, Uris, Auth) {

        $scope.image = image;
        $scope.images = images;
        $scope.depicts = depicts;

        // Setup creator and rights
        if (image[Uris.DCT_CREATOR] === Auth.email) {
            $scope.image.$creator = 'creator';
        } else {
            $scope.image.$creator = 'other';
        }

        if (image[Uris.DCT_RIGHTS] === Auth.email) {
            $scope.image.$rights = 'owner';
        } else if (image[Uris.DCT_RIGHTS] && image[Uris.DCT_RIGHTS].indexOf('permission') !== -1) {
            $scope.image.$rights = 'permission';
        } else if (image[Uris.DCT_RIGHTS] && image[Uris.DCT_RIGHTS].indexOf('orphaned') !== -1) {
            $scope.image.$rights = 'orphaned';
        }


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

        $scope.save = function (image) {
            console.log('saving');
            Expression.update(image.uri, image).then(function () {
                console.log('saved');
                $state.go(image.$stateTo('view'), image.$stateParams);
            });
        };

    });