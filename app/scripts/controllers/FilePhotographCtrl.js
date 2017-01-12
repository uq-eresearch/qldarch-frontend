'use strict';

angular.module('qldarchApp').controller('FilePhotographCtrl',
    function($scope, $upload, Uris, $http, Structure, File, $state, $stateParams, Expression, Entity) {

      $scope.expressions = [];

      var tempExpression = {};
      tempExpression[Uris.DCT_TITLE] = 'file name';
      tempExpression[Uris.RDF_TYPE] = 'http://qldarch.net/ns/rdf/2012-06/terms#Photograph';
      tempExpression[Uris.QA_DEPICTS_BUILDING] = 'http://qldarch.net/users/cking/Structure#61816694616';

      // @todo, add 'type' to state param requests
      if ($stateParams.uri && $stateParams.name) {
        $scope.selectedProject = {
          id : $stateParams.uri,
          uri : $stateParams.uri,
          text : $stateParams.name,
          type : $stateParams.type,
          name : $stateParams.name,
          encodedUri : btoa($stateParams.uri)
        };
      }

      $scope.onFileSelect = function($files) {
        // $files: an array of files selected, each file has name, size, and
        // type.
        angular.forEach($files, function(file) {
          console.log('file', file);
          // Create an expression for each file
          var expression = {};
          expression.$uploadFile = file;
          // expression[Uris.DCT_TITLE] =
          // Default type to photograph
          expression[Uris.RDF_TYPE] = 'http://qldarch.net/ns/rdf/2012-06/terms#Photograph';

          $scope.expressions.unshift(expression);
          $scope.myModelObj = {};
          expression.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
            expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
            expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
          }).success(function(data) {
            // file is uploaded successfully
            expression[Uris.QA_HAS_FILE] = data.uri;
            expression.$file = File.setupImageUrls(data);
          }).error(function() {
            // Something went wrong uploading the file
            console.log('File upload failed');
            var index = $scope.expressions.indexOf(expression);
            $scope.expressions.splice(index, 1);
          });
        });

        jQuery('html, body').animate({
          scrollTop : jQuery('#uploads').offset().top + 'px'
        }, 500, 'swing', function() {
        });
      };

      $scope.cancelUpload = function(expression) {

        // Remove the expression
        var index = $scope.expressions.indexOf(expression);
        $scope.expressions.splice(index, 1);

        // Cancel the upload
        expression.$upload.abort();
      };

      $scope.publish = function(expression) {
        // Setup depicts
        if ($scope.selectedProject.type === 'structure') {
          expression[Uris.QA_DEPICTS_BUILDING] = $scope.selectedProject.uri;
        } else if ($scope.selectedProject.type === 'architect') {
          expression[Uris.QA_DEPICTS_ARCHITECT] = $scope.selectedProject.uri;
        } else if ($scope.selectedProject.type === 'firm') {
          expression[Uris.QA_DEPICTS_FIRM] = $scope.selectedProject.uri;
        }

        expression.$depicts = $scope.selectedProject;
        var params = {};
        params.structureId = $scope.selectedProject.encodedUri;
        var uploadType;
        if (expression[Uris.RDF_TYPE] === Uris.QA_LINEDRAWING_TYPE) {
          uploadType = 'lineDrawings';
        } else {
          uploadType = 'photographs';
        }
        expression.$depictsLink = $state.href('structure' + '.' + uploadType, params);

        Expression.create(expression);
      };

      /*
       * ===================================================== Select2 Boxes
       * =====================================================
       */
      $scope.$watch('selectedProject', function(project) {
        if ($scope.selectedProject && $scope.selectedProject.type !== 'structure') {
          for (var i = 0; i < $scope.expressions.length; i++) {
            $scope.expressions[i][Uris.RDF_TYPE] = Uris.QA_PHOTOGRAPH_TYPE;
          }
        }
        if (project && project.id === 'new') {
          $state.go('structure.summary.edit', {
            structureId : null
          });
        }
      });

      // Setup the entity select boxes
      $scope.structureSelect = {
        placeholder : 'Select an Architect, Project or Firm',
        dropdownAutoWidth : true,
        multiple : false,
        // minimumInputLength: 2,
        query : function(options) {
          Entity.findByName(options.term, false).then(function(entities) {
            var data = {
              results : []
            };

            angular.forEach(entities, function(entity) {
              if (entity.type !== 'architect' && entity.type !== 'structure' && entity.type !== 'firm') {
                return;
              }

              var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
              if (entity.type === 'structure') {
                label = entity.name + ' (Project)';
              }
              if (entity.type === 'firm') {
                label = entity.name + ' (Firm)';
              }

              data.results.unshift({
                id : entity.uri,
                uri : entity.uri,
                text : label,
                type : entity.type,
                name : entity.name,
                encodedUri : entity.encodedUri,
                picture : entity.picture
              });
            });
            options.callback(data);
          });
        }
      };
    });