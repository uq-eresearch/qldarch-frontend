'use strict';

angular.module('qldarchApp').controller('UserFilesDocumentsCtrl', function($scope, $filter, mediadocuments) {
  mediadocuments = $filter('orderBy')(mediadocuments, function(mediadocument) {
    return mediadocument.label;
  });
  $scope.mediadocuments = mediadocuments;
});