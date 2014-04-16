'use strict';

angular.module('angularApp')
    .controller('UserFilesCtrl', function ($scope, expressions, GraphHelper, $filter, Uris, LayoutHelper) {
        console.log('running controller');
        console.log('expressions', expressions);
        $scope.expressions = expressions;

        // Filtero ut only photos
        var photographs = $filter('filter')(expressions, function (expression) {
            return GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_PHOTOGRAPH_TYPE) !== -1 || GraphHelper.asArray(expression[Uris.RDF_TYPE]).indexOf(Uris.QA_LINEDRAWING_TYPE) !== -1;
        });
        $scope.photographRows = LayoutHelper.group(photographs, 6);

        // http://localhost:9000/#/project/line-drawing/?structureId=aHR0cDovL3FsZGFyY2gubmV0L3VzZXJzL2NraW5nL1N0cnVjdHVyZSM2MTgxNjY5NDYxNg%3D%3D
        // http://localhost:9000/#/project/line-drawing/aHR0cDovL3FsZGFyY2gubmV0L3VzZXJzL2NtY25hbWFyYTg3QGdtYWlsLmNvbS9MaW5lRHJhd2luZyM2OTUwNjc3MzU5MA==?structureId=aHR0cDovL3FsZGFyY2gubmV0L3VzZXJzL2NraW5nL1N0cnVjdHVyZSM2MTgxNjY5NDYxNg%3D%3D
    });