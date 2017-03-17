'use strict';

angular.module('qldarchApp').controller('UploadDocumentsCtrl',
    function($scope, $filter, $upload, File, $state, $stateParams, firms, architects, structures) {

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
        }
      }

      $scope.expressions = [];

      var archobjs = [];

      angular.forEach(architects, function(architect) {
        architect.detailtype = '(Person)';
      });

      angular.forEach(firms, function(firm) {
        firm.detailtype = '(Firm)';
      });

      angular.forEach(structures, function(structure) {
        structure.detailtype = '(Project)';
      });

      archobjs = architects.concat(firms).concat(structures);

      archobjs = $filter('orderBy')(archobjs, function(archobj) {
        return archobj.label;
      });

      if ($stateParams.id && $stateParams.name) {
        $scope.selectedObj = {
          id : $stateParams.id,
          text : $stateParams.name + ' (' + $stateParams.type.charAt(0).toUpperCase() + $stateParams.type.slice(1) + ')',
        };
        $scope.selectedTitle = $stateParams.name;
      }

      $scope.onFileSelect = function($files) {
        // $files: an array of files selected, each file has name, size, and
        // type.
        angular.forEach($files, function(file) {
          console.log('file', file);
          // Create an expression for each file
          var expression = {};
          expression.$uploadFile = file;

          $scope.expressions.unshift(expression);
          $scope.myModelObj = {
            depicts : $stateParams.id,
            label : $scope.selectedTitle,
            type : 'Article'
          };
          expression.id = $stateParams.id;
          expression.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
            expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
            expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
          }).success(function() {
            goToArticles();
          }).error(function() {
            // Something went wrong uploading the file
            console.log('File upload failed');
            var index = $scope.expressions.indexOf(expression);
            $scope.expressions.splice(index, 1);
          });
        });
      };

      $scope.cancelUpload = function() {
        goToArticles();
      };

      // Setup the entity select boxes
      $scope.archObjSelect = {
        placeholder : 'Select an Architect or Firm or Project',
        dropdownAutoWidth : true,
        multiple : false,
        // minimumInputLength: 2,
        query : function(options) {
          var data = {
            results : []
          };
          angular.forEach(archobjs, function(archobj) {
            data.results.push({
              id : archobj.id,
              text : archobj.label + ' ' + archobj.detailtype
            });
          });
          options.callback(data);
        }
      };

    });