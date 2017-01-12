'use strict';

angular.module('qldarchApp').controller('UploadInterviewsCtrl',
    function($scope, interview, GraphHelper, Entity, Uris, $cacheFactory, File, Expression, toaster, $state) {

      $scope.interview = interview;
      interview.$audioFiles = [];
      interview.$transcriptFiles = [];

      function isValidYoutubeUrl(url) {
        return url.indexOf('you') !== -1 && url.indexOf('ogg') === -1 && url.indexOf('mp3') === -1;
      }

      function setupYoutubeUrls() {
        // Setup the youtube url
        angular.forEach($scope.interview[Uris.QA_EXTERNAL_LOCATION], function(externalLocation) {
          if (isValidYoutubeUrl(externalLocation)) {
            // found the youtube url
            $scope.interview.$youtubeUrl = externalLocation;
          }
        });
      }

      function activate() {
        setupYoutubeUrls();
      }

      activate();

      function removeYoutubeUrlsFromExternalLocations() {
        var youtubeUrlIndex;
        angular.forEach($scope.interview[Uris.QA_EXTERNAL_LOCATION], function(externalLocation, index) {
          if (isValidYoutubeUrl(externalLocation)) {
            // found the youtube url
            youtubeUrlIndex = index;
          }
        });
        if (angular.isDefined(youtubeUrlIndex)) {
          $scope.interview[Uris.QA_EXTERNAL_LOCATION].splice(youtubeUrlIndex, 1);
        }
      }

      function moveYoutubeUrlIntoInterview() {
        // Remove any existing ones
        removeYoutubeUrlsFromExternalLocations();

        // Add in the new one (if it exists)
        if ($scope.interview.$youtubeUrl && $scope.interview.$youtubeUrl.length) {
          $scope.interview[Uris.QA_EXTERNAL_LOCATION] = GraphHelper.asArray($scope.interview[Uris.QA_EXTERNAL_LOCATION]);
          $scope.interview[Uris.QA_EXTERNAL_LOCATION].push($scope.interview.$youtubeUrl);
        }
      }

      $scope.onAudioFileSelect = function($files) {
        // $files: an array of files selected, each file has name, size, and
        // type.
        angular.forEach($files, function(file) {
          console.log('file', file);
          // Create an expression for each files
          var newFile = {};
          $scope.interview.$audioFiles.unshift(newFile);
          newFile.uploadFile = file;
          newFile.uploadFn = File.upload($scope.myModelObj, file).progress(function(evt) {
            newFile.uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
            newFile.uploadFile.isComplete = newFile.uploadFile.percent === 100;
          }).success(function(data) {
            // file is uploaded successfully
            $scope.interview[Uris.QA_HAS_FILE] = $scope.interview[Uris.QA_HAS_FILE] || [];
            $scope.interview[Uris.QA_HAS_FILE].push(data.uri);

            // Set the transcript
            $scope.interview[Uris.QA_EXTERNAL_LOCATION] = $scope.interview[Uris.QA_EXTERNAL_LOCATION] || [];
            $scope.interview[Uris.QA_EXTERNAL_LOCATION].push(Uris.OMEKA_FILE_ROOT + data[Uris.QA_SYSTEM_LOCATION]);
          });
        });
      };

      $scope.onTranscriptFileSelect = function($files) {
        // $files: an array of files selected, each file has name, size, and
        // type.
        angular.forEach($files, function(file) {
          console.log('file', file);
          // Create an expression for each files
          var newFile = {};
          newFile.uploadFile = file;
          newFile.uploadFn = File.upload({
            id : atob($state.params.id)
          }, file).progress(function(evt) {
            newFile.uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
            newFile.uploadFile.isComplete = newFile.uploadFile.percent === 100;
          }).success(function(data) {
            // file is uploaded successfully
            if (angular.isDefined(data[Uris.QA_TRANSCRIPT_FILE])) {
              // It's been processed as a transcript file
              // Set the hasTrascript property
              $scope.interview[Uris.QA_HAS_TRANSCRIPT] = data.uri;
              // Set a shortcut to the transcript file
              $scope.interview[Uris.QA_TRANSCRIPT_LOCATION] = Uris.OMEKA_FILE_ROOT + data[Uris.QA_TRANSCRIPT_FILE];
            } else {
              if (data.msg) {
                toaster.pop('error', data.msg);
              } else {
                toaster.pop('error', 'Transcript couldn\'t be processed', 'Sorry this transcript couldn\'t be processed');
              }
            }
          });
        });
      };

      function clearInterviewCache(expression) {
        $cacheFactory.get('$http').remove('/ws/rest/expression/detail/qldarch%3AInterview?INCSUBCLASS=false&');
        $cacheFactory.get('$http').remove('/ws/rest/expression/summary/qldarch%3AInterview?INCSUBCLASS=false&');
        $cacheFactory.get('$http').remove('/ws/rest/expression/description?SUMMARY=false&IDLIST=' + encodeURIComponent(expression.uri));
      }

      function isNewInterview(interview) {
        var isNew = !interview.uri;
        console.log('New interview', isNew);
        return isNew;
      }

      function goToInterview() {
        $state.go($scope.interview.$state, $scope.interview.$stateParams);
      }

      $scope.create = function(expression) {
        clearInterviewCache(expression);

        moveYoutubeUrlIntoInterview();

        if (isNewInterview(expression)) {
          Expression.create(expression).then(goToInterview);
          return;
        }
        Expression.update(expression.uri, expression).then(goToInterview);
      };
      $scope.cancel = function() {
        if (isNewInterview($scope.interview)) {
          $state.go('user.files.interviews');
          return;
        }
        $state.go($scope.interview.$state, $scope.interview.$stateParams);
      };

      $scope.removeAudioFile = function(file) {
        var index = $scope.interview.files.indexOf(file);
        $scope.interview.files.splice(index, 1);

        index = $scope.interview[Uris.QA_HAS_FILE].indexOf(file.uri);
        $scope.interview[Uris.QA_HAS_FILE].splice(index, 1);

        index = $scope.interview[Uris.QA_EXTERNAL_LOCATION].indexOf(Uris.OMEKA_FILE_ROOT + file[Uris.QA_SYSTEM_LOCATION]);
        $scope.interview[Uris.QA_EXTERNAL_LOCATION].splice(index, 1);
      };
      $scope.removeNewAudioFile = function(file) {
        var index = $scope.interview.$audioFiles.indexOf(file);
        $scope.interview.$audioFiles.splice(index, 1);

        index = $scope.interview[Uris.QA_HAS_FILE].indexOf(file.uri);
        $scope.interview[Uris.QA_HAS_FILE].splice(index, 1);

        index = $scope.interview[Uris.QA_EXTERNAL_LOCATION].indexOf(Uris.OMEKA_FILE_ROOT + file[Uris.QA_SYSTEM_LOCATION]);
        $scope.interview[Uris.QA_EXTERNAL_LOCATION].splice(index, 1);
      };

      $scope.removeTranscript = function() {
        delete $scope.interview[Uris.QA_HAS_TRANSCRIPT];
        delete $scope.interview[Uris.QA_TRANSCRIPT_LOCATION];
      };

      /*
       * ===================================================== Select2 Boxes
       * =====================================================
       */

      /**
       * Clears the cache for the select so that if a new person is added, the
       * select is refreshed with the newly added list.
       * 
       * @return {} [description]
       */
      $scope.clearSelectCache = function() {
        $cacheFactory.get('$http').remove('/ws/rest/entity/detail/qldarch%3ANonDigitalThing?INCSUBCLASS=true&');
      };

      // Update our model when the selected interviewers change
      $scope.$watch('interview.$interviewees', function(selectedInterviewees) {
        $scope.interview[Uris.QA_INTERVIEWEE] = [];
        $scope.interview[Uris.DCT_TITLE] = '';
        angular.forEach(selectedInterviewees, function(interviewee) {
          $scope.interview[Uris.QA_INTERVIEWEE].push(interviewee.uri);
          $scope.interview[Uris.DCT_TITLE] += interviewee.name + ' ';
        });
        $scope.interview[Uris.DCT_TITLE] += 'Interview';
      });

      $scope.$watch('interview.$interviewers', function(selectedInterviewers) {
        $scope.interview[Uris.QA_INTERVIEWER] = [];
        angular.forEach(selectedInterviewers, function(interviewer) {
          $scope.interview[Uris.QA_INTERVIEWER].push(interviewer.uri);
        });
      });

      // Setup the entity select boxes
      $scope.personSelect = {
        placeholder : 'Select a Person',
        dropdownAutoWidth : true,
        multiple : true,
        minimumInputLength : 2,
        query : function(options) {
          console.log('querying!');
          Entity.findByName(options.term, false).then(function(entities) {
            var data = {
              results : []
            };
            angular.forEach(entities, function(entity) {
              var types = GraphHelper.asArray(entity[Uris.RDF_TYPE]);
              if (types.indexOf(Uris.QA_ARCHITECT_TYPE) === -1 || types.indexOf(Uris.FOAF_PERSON_TYPE) === -1) {

              }
              data.results.unshift(entity);
            });
            options.callback(data);
          });
        }
      };

    });