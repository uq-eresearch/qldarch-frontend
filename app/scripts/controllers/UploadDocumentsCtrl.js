'use strict';

angular.module('qldarchApp').controller('UploadDocumentsCtrl',
    function($scope, $upload, Uris, $http, Structure, File, $state, $stateParams, Expression) {

      $scope.expressions = [];

      $scope.onFileSelect = function($files) {
        // $files: an array of files selected, each file has name, size, and
        // type.
        angular.forEach($files, function(file) {
          console.log('file', file);
          // Create an expression for each file
          var expression = {};
          expression.$article = {};
          expression.$interview = {};
          expression.$uploadFile = file;

          // Default type to articles
          expression[Uris.RDF_TYPE] = Uris.QA_ARTICLE_TYPE;

          $scope.expressions.unshift(expression);

          expression.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
            expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
            expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
          }).success(function(data) {
            // file is uploaded successfully
            expression[Uris.QA_HAS_FILE] = data.uri;
            expression.$file = File.setupImageUrls(data);
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
        // Import data from type
        if (expression[Uris.RDF_TYPE] === Uris.QA_ARTICLE_TYPE) {
          var article = expression.$article;
          delete expression.$article;
          angular.extend(expression, article);
        } else if (expression[Uris.RDF_TYPE] === Uris.QA_INTERVIEW_TYPE) {
          var interview = expression.$interview;
          delete expression.$article;
          angular.extend(expression, interview);
        }

        console.log('expression', expression);
        Expression.create(expression);
      };

      /*
       * ===================================================== Select2 Boxes
       * =====================================================
       */
      $scope.$watch('selectedProject', function(project) {
        if (project && project.id === 'new') {
          $state.go('structure.summary.edit', {
            structureId : null
          });
        }
      });

      // Setup the entity select boxes
      $scope.structureSelect = {
        placeholder : 'Select a Project',
        dropdownAutoWidth : true,
        multiple : false,
        // minimumInputLength: 2,
        query : function(options) {
          Structure.findByName(options.term, false).then(function(entities) {
            var data = {
              results : [ {
                id : 'new',
                text : 'Create a new Project'
              } ]
            };

            angular.forEach(entities, function(entity) {
              var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
              if (entity.type === 'structure') {
                label = entity.name + ' (Project)';
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