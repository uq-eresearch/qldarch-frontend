'use strict';

angular.module('qldarchApp').controller(
    'UploadInterviewsCtrl',
    function($scope, interview, architects, $filter, GraphHelper, Entity, Uris, $cacheFactory, File, Expression, toaster, $state, $stateParams,
        ArchObj) {

      $scope.interview = interview;
      interview.$audioFiles = [];
      interview.$transcriptFiles = [];

      architects = $filter('orderBy')(architects, function(architect) {
        return architect.label;
      });

      $scope.interview.$interviewees = null;
      if (angular.isDefined(interview.interviewee)) {
        $scope.interview.$interviewees = [];
        angular.forEach(interview.interviewee, function(person) {
          $scope.interview.$interviewees.push({
            id : person.id,
            text : person.label
          });
        });
      }

      $scope.interview.$interviewers = null;
      if (angular.isDefined(interview.interviewer)) {
        $scope.interview.$interviewers = [];
        angular.forEach(interview.interviewer, function(person) {
          $scope.interview.$interviewers.push({
            id : person.id,
            text : person.label
          });
        });
      }

      var dataPersonSelect = {
        results : []
      };

      angular.forEach(architects, function(architect) {
        dataPersonSelect.results.push({
          id : architect.id,
          text : architect.label
        });
      });

      $scope.personSelect = {
        placeholder : 'Select a Person',
        dropdownAutoWidth : true,
        multiple : true,
        data : dataPersonSelect
      };

      $scope.interview.$youtubeUrl = null;
      if (angular.isDefined(interview.media)) {
        angular.forEach(interview.media, function(media) {
          if (media.type === 'Youtube') {
            $scope.interview.$youtubeUrl = media;
          }
        });
      }

      function uploadAudio(data, file) {
        var expAudio = {};
        expAudio.$uploadFile = file;
        $scope.myModelObj = {
          depicts : data.id,
          label : data.label,
          type : 'Audio'
        };
        expAudio.id = $stateParams.id;
        expAudio.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
          expAudio.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
          expAudio.$uploadFile.isComplete = expAudio.$uploadFile.percent === 100;
        }).success(function() {
          console.log('Audio File upload succeeded');
        }).error(function() {
          // Something went wrong uploading the file
          console.log('Audio File upload failed');
        });
      }

      function uploadTranscript(data, file) {
        var expTranscript = {};
        expTranscript.$uploadFile = file;
        $scope.myModelObj = {
          depicts : data.id,
          label : data.label,
          type : 'Transcript'
        };
        expTranscript.id = $stateParams.id;
        expTranscript.$upload = File.upload($scope.myModelObj, file).progress(function(evt) {
          expTranscript.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
          expTranscript.$uploadFile.isComplete = expTranscript.$uploadFile.percent === 100;
        }).success(function() {
          console.log('Transcript File upload succeeded');
        }).error(function() {
          // Something went wrong uploading the file
          console.log('Transcript File upload failed');
        });
      }

      $scope.updateInterview = function(data, $audiofile, $transcriptfile) {
        if (data.id) {
          ArchObj.updateInterview(data).then(function(response) {
            if ($audiofile) {
              uploadAudio(response, $audiofile).then(function(response) {
                if ($transcriptfile) {
                  uploadTranscript(response, $transcriptfile);
                }
              });
            }
            $state.go('interview', {
              interviewId : data.id
            });
          }).catch(function(error) {
            console.log('Failed to save', error);
            $state.go('upload.interview', {
              id : data.id
            });
          });
        } else {
          ArchObj.createInterview(data).then(function(response) {
            if ($audiofile) {
              uploadAudio(response, $audiofile).then(function(response) {
                if ($transcriptfile) {
                  uploadTranscript(response, $transcriptfile);
                }
              });
            }
            $state.go('interview', {
              interviewId : response.id
            });
          }).catch(function(error) {
            console.log('Failed to save', error);
            $state.go('interviews');
          });
        }
      };

      $scope.removeAudioFile = function() {
        console.log('removeAudioFile');
      };

      $scope.removeTranscript = function() {
        console.log('removeTranscript');
      };

      $scope.cancel = function() {
        if (interview.id) {
          $state.go('interview', {
            interviewId : interview.id
          });
        } else {
          $state.go('user.files.interviews');
        }
      };

    });