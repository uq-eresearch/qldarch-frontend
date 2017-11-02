'use strict';

angular.module('qldarchApp').controller('UploadInterviewsCtrl',
    function($scope, interview, architects, personnotarchitect, $filter, $cacheFactory, File, toaster, $state, $stateParams, ArchObj) {

      $scope.interview = interview;

      interview.media = $filter('orderBy')(interview.media, function(med) {
        return (med.preferred || '');
      }, true);

      var person = architects.concat(personnotarchitect);
      person = $filter('orderBy')(person, function(p) {
        return p.label;
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

      angular.forEach(person, function(p) {
        dataPersonSelect.results.push({
          id : p.id,
          text : p.label
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

      function uploadMedia(data, file) {
        $scope.expAudio = {};
        $scope.expAudio.$uploadFile = file;
        $scope.myModelObj = {
          depicts : data.id,
          label : data.label,
          type : data.type
        };
        $scope.expAudio.id = $stateParams.id;
        return File.upload($scope.myModelObj, file).progress(function(evt) {
          $scope.expAudio.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(res) {
          $scope.expAudio.$uploadFile.isComplete = $scope.expAudio.$uploadFile.percent === 100;
          console.log('audio file upload succeeded');
          return res;
        }).error(function(err) {
          toaster.pop('error', 'Error occured', err.data.msg);
          console.log('audio file upload failed: ' + err.data.msg);
          return err;
        });
      }

      function uploadTranscript(data, file) {
        $scope.expTranscript = {};
        $scope.expTranscript.$uploadFile = file;
        $scope.myModelObj = {
          depicts : data.id,
          label : data.label,
          type : 'Transcript'
        };
        $scope.expTranscript.id = $stateParams.id;
        return File.upload($scope.myModelObj, file).progress(function(evt) {
          $scope.expTranscript.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(res) {
          $scope.expTranscript.$uploadFile.isComplete = $scope.expTranscript.$uploadFile.percent === 100;
          console.log('transcript file upload succeeded');
          return res;
        }).error(function(err) {
          toaster.pop('error', 'Error occured', err.data.msg);
          console.log('transcript file upload failed: ' + err.data.msg);
          return err;
        });
      }

      function goToInterview(id) {
        $state.go('interview', {
          interviewId : id
        });
      }

      $scope.isDisabled = false;

      function disableButton() {
        $scope.isDisabled = true;
      }

      $scope.updateInterview = function(data, $mediafile, $transcriptfile) {
        disableButton();
        if (data.id) {
          ArchObj.updateInterview(data).then(function() {
            if ($mediafile) {
              var filetype = $mediafile[0].type;
              if (filetype.indexOf('video') === -1 && filetype.indexOf('audio') === -1) {
                goToInterview(data.id);
              } else {
                if (filetype.indexOf('video') !== -1) {
                  data.type = 'Video';
                }
                if (filetype.indexOf('audio') !== -1) {
                  data.type = 'Audio';
                }
                uploadMedia(data, $mediafile).then(function() {
                  if ($transcriptfile) {
                    uploadTranscript(data, $transcriptfile).then(function() {
                      goToInterview(data.id);
                    });
                  } else {
                    goToInterview(data.id);
                  }
                });
              }
            } else {
              if ($transcriptfile) {
                uploadTranscript(data, $transcriptfile).then(function() {
                  goToInterview(data.id);
                });
              } else {
                goToInterview(data.id);
              }
            }
          }).catch(function() {
            goToInterview(data.id);
          });
        } else {
          ArchObj.createInterview(data).then(function(response) {
            if ($mediafile) {
              var filetype = $mediafile[0].type;
              if (filetype.indexOf('video') === -1 && filetype.indexOf('audio') === -1) {
                goToInterview(response.id);
              } else {
                if (filetype.indexOf('video') !== -1) {
                  response.type = 'Video';
                }
                if (filetype.indexOf('audio') !== -1) {
                  response.type = 'Audio';
                }
                uploadMedia(response, $mediafile).then(function() {
                  if ($transcriptfile) {
                    uploadTranscript(response, $transcriptfile).then(function() {
                      goToInterview(response.id);
                    });
                  } else {
                    goToInterview(response.id);
                  }
                });
              }
            } else {
              goToInterview(response.id);
            }
          }).catch(function() {
            $state.go('user.files.interviews');
          });
        }
      };

      $scope.setPreferred = function(data) {
        File.preferred(data.id).then(function() {
          goToInterview(interview.id);
        });
      };

      $scope.delete = function(data) {
        var r = window.confirm('Delete file ' + data.filename + '?');
        if (r === true) {
          File.delete(data.id).then(function() {
            for (var i = 0; i < $scope.interview.media.length; i++) {
              if ($scope.interview.media[i].id === data.id) {
                $scope.interview.media.splice(i, 1);
              }
            }
          });
        }
      };

      $scope.cancel = function() {
        if (interview.id) {
          goToInterview(interview.id);
        } else {
          $state.go('user.files.interviews');
        }
      };
    });