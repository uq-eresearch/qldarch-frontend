'use strict';

angular.module('qldarchApp').config(function($stateProvider) {
  $stateProvider.state('user.files.documents', {
    url : '/documents',
    resolve : {},
    controller : 'UserFilesDocumentsCtrl',
    templateUrl : 'views/user.files.documents.html'
  });
});