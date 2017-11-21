'use strict';

angular.module('qldarchApp').controller('FilePhotographCtrl',
    function($scope, $filter, $upload, File, $state, $stateParams, firms, architects, structures, ImageTypes, toaster) {

      function goToPhotographs() {
        var params = {};
        if ($stateParams.type === 'person') {
          params.architectId = $stateParams.id;
          $state.go('architect.photographs', params);
        } else if ($stateParams.type === 'firm') {
          params.firmId = $stateParams.id;
          $state.go('firm.photographs', params);
        } else if ($stateParams.type === 'structure') {
          params.structureId = $stateParams.id;
          $state.go('structure.photographs', params);
        } else {
          $state.go('user.files.images');
        }
      }

      $scope.imageType = {
        id : 'Image',
        text : 'Image'
      };

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
          // Create an expression for each file
          var expression = {};
          expression.$uploadFile = file;

          $scope.expressions.unshift(expression);
          $scope.myModelObj = {
            depicts : $scope.selectedObj.id,
            label : $scope.selectedTitle,
            type : $scope.imageType.id
          };
          if (angular.isDefined($scope.image)) {
            if (angular.isDefined($scope.image.description)) {
              $scope.myModelObj.description = $scope.image.description;
            }
            if (angular.isDefined($scope.image.creator)) {
              $scope.myModelObj.creator = $scope.image.creator;
            }
            if (angular.isDefined($scope.image.created)) {
              $scope.myModelObj.created = $scope.image.created;
            }
            if (angular.isDefined($scope.image.rights)) {
              $scope.myModelObj.rights = $scope.image.rights;
            }
            if (angular.isDefined($scope.image.identifier)) {
              $scope.myModelObj.identifier = $scope.image.identifier;
            }
          }
          expression.id = $stateParams.id;
          expression.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
            expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
          }).success(function() {
            expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
            console.log('image file upload succeeded');
            goToPhotographs();
          }).error(function(err) {
            // Something went wrong uploading the file
            toaster.pop('error', 'Error occured', err.data.msg);
            console.log('image file upload failed');
            var index = $scope.expressions.indexOf(expression);
            $scope.expressions.splice(index, 1);
          });
        });
      };

      $scope.cancelUpload = function() {
        goToPhotographs();
      };

      var archObjData = {
        results : []
      };
      angular.forEach(archobjs, function(archobj) {
        archObjData.results.push({
          id : archobj.id,
          text : archobj.label + ' ' + archobj.detailtype
        });
      });

      // Setup the entity select boxes
      $scope.archObjSelect = {
        placeholder : 'Select an Architect or Firm or Project',
        dropdownAutoWidth : true,
        multiple : false,
        // minimumInputLength: 2,
        data : archObjData
      };

      $scope.imageTypeSelect = {
        placeholder : 'Select an Image Type',
        dropdownAutoWidth : true,
        multiple : false,
        query : function(options) {
          var data = {
            results : []
          };
          for ( var type in ImageTypes) {
            data.results.push({
              id : type,
              text : ImageTypes[type]
            });
          }
          options.callback(data);
        }
      };
    });