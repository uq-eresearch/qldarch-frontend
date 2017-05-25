'use strict';

angular.module('qldarchApp').controller('UploadDocumentsCtrl', function($scope, $filter, $upload, File, $state, $stateParams, ArchObj, toaster) {

  $scope.article = {
    type : 'article',
    label : $stateParams.name
  };

  function goToArticles() {
    var params = {};
    if ($stateParams.type === 'person') {
      params.architectId = $stateParams.id;
      $state.go('architect.articles', params);
    } else if ($stateParams.type === 'firm') {
      params.firmId = $stateParams.id;
      $state.go('firm.articles', params);
    } else if ($stateParams.type === 'structure') {
      params.structureId = $stateParams.id;
      $state.go('structure.articles', params);
    } else {
      $state.go('articles');
    }
  }

  $scope.expressions = [];

  $scope.onFileSelect = function($files, article) {
    // $files: an array of files selected, each file has name, size, and
    // type.
    angular.forEach($files, function(file) {
      ArchObj.createArticle(article).then(function(response) {
        // Create an expression for each file
        var expression = {};
        expression.$uploadFile = file;
        $scope.expressions.unshift(expression);
        $scope.myModelObj = {
          depicts : response.id,
          label : response.label,
          type : 'Article'
        };
        expression.id = $stateParams.id;
        expression.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
          expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function() {
          expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
          console.log('article file upload succeeded');
          goToArticles();
        }).error(function(err) {
          toaster.pop('error', 'Error occured', err.data.msg);
          console.log('article file upload failed: ' + err.data.msg);
          var index = $scope.expressions.indexOf(expression);
          $scope.expressions.splice(index, 1);
        });
      }).catch(function() {
        goToArticles();
      });
    });
  };

  $scope.cancelUpload = function() {
    goToArticles();
  };
});