'use strict';

angular.module('angularApp')
    .controller('UserFilesCtrl', function ($scope, expressions, GraphHelper, $filter, Uris, LayoutHelper) {
        console.log('running controller');
        console.log('expressions', expressions);

        // Filtero ut only photos
        $scope.photographRows = LayoutHelper.group(expressions, 6);

        // http://localhost:9000/#/project/line-drawing/?structureId=aHR0cDovL3FsZGFyY2gubmV0L3VzZXJzL2NraW5nL1N0cnVjdHVyZSM2MTgxNjY5NDYxNg%3D%3D
        // http://localhost:9000/#/project/line-drawing/aHR0cDovL3FsZGFyY2gubmV0L3VzZXJzL2NtY25hbWFyYTg3QGdtYWlsLmNvbS9MaW5lRHJhd2luZyM2OTUwNjc3MzU5MA==?structureId=aHR0cDovL3FsZGFyY2gubmV0L3VzZXJzL2NraW5nL1N0cnVjdHVyZSM2MTgxNjY5NDYxNg%3D%3D
    });