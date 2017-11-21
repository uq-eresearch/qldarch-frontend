'use strict';

angular.module('qldarchApp').controller('FileVideoCtrl',
    function($scope, $filter, $upload, File, $state, $stateParams, firms, architects, structures, toaster) {

      function goToVideos() {
        var params = {};
        if ($stateParams.type === 'person') {
          params.architectId = $stateParams.id;
          $state.go('architect.videos', params);
        } else if ($stateParams.type === 'firm') {
          params.firmId = $stateParams.id;
          $state.go('firm.videos', params);
        } else if ($stateParams.type === 'structure') {
          params.structureId = $stateParams.id;
          $state.go('structure.videos', params);
        } else {
          $state.go('user.files.videos');
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
          // Create an expression for each file
          var expression = {};
          expression.$uploadFile = file;

          $scope.expressions.unshift(expression);
          $scope.myModelObj = {
            depicts : $scope.selectedObj.id,
            label : $scope.selectedTitle,
            type : 'Video'
          };
          if (angular.isDefined($scope.video)) {
            if (angular.isDefined($scope.video.description)) {
              $scope.myModelObj.description = $scope.video.description;
            }
            if (angular.isDefined($scope.video.creator)) {
              $scope.myModelObj.creator = $scope.video.creator;
            }
            if (angular.isDefined($scope.video.created)) {
              $scope.myModelObj.created = $scope.video.created;
            }
            if (angular.isDefined($scope.video.rights)) {
              $scope.myModelObj.rights = $scope.video.rights;
            }
            if (angular.isDefined($scope.video.identifier)) {
              $scope.myModelObj.identifier = $scope.video.identifier;
            }
          }
          expression.id = $stateParams.id;
          expression.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
            expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
          }).success(function() {
            expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
            console.log('video file upload succeeded');
            goToVideos();
          }).error(function(err) {
            // Something went wrong uploading the file
            toaster.pop('error', 'Error occured', err.data.msg);
            console.log('video file upload failed');
            var index = $scope.expressions.indexOf(expression);
            $scope.expressions.splice(index, 1);
          });
        });
      };

      $scope.cancelUpload = function() {
        goToVideos();
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

    });