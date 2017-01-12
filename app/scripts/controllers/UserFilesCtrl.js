'use strict';

angular.module('qldarchApp').controller('UserFilesCtrl', function($scope, expressions, GraphHelper, $filter, Uris, LayoutHelper) {
  console.log('running controller');
  console.log('expressions', expressions);

  // Filtero ut only photos
  $scope.photographRows = LayoutHelper.group(expressions, 6);
});