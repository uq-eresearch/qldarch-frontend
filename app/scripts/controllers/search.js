'use strict';

angular.module('angularApp')
    .controller('SearchCtrl', function ($scope,
                                        $location,
                                        $http) {


        activate();

        function activate() {
            $scope.query = $location.search().query;
            $http.get('ws/search?q=' + $scope.query + '&p=0&pc=5&pretty').then(function (response) {
                $scope.results = response.data.documents;
            });
        }
    });
