'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('upload.documents', {
    url : '/documents',
    templateUrl : 'views/upload.documents.html',
    controller : 'UploadDocumentsCtrl'
  });
});