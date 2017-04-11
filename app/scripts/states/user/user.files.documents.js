'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.documents', {
    url : '/documents',
    resolve : {
      mediadocuments : [ 'mediaowned', '$filter', function(mediaowned, $filter) {
        return $filter('filter')(mediaowned, function(med) {
          return (med.type === 'Article' || med.type === 'Text' || med.type === 'Spreadsheet');
        });
      } ]
    },
    controller : 'UserFilesDocumentsCtrl',
    templateUrl : 'views/user.files.documents.html'
  });
});