'use strict';

angular.module('angularApp')
    .controller('UploadInterviewsCtrl', function ($scope, GraphHelper, Entity, Uris, $cacheFactory, File, Expression) {

        $scope.expression = {};
        $scope.expression[Uris.RDF_TYPE] = Uris.QA_INTERVIEW_TYPE;
        $scope.expression[Uris.QA_EXTERNAL_LOCATION] = [];
        $scope.expression[Uris.QA_HAS_FILE] = [];
        $scope.expression.$audioFiles = [];

        $scope.onAudioFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            angular.forEach($files, function (file) {
                console.log('file', file);
                // Create an expression for each files
                var newFile = {};
                $scope.expression.$audioFiles.unshift(newFile);
                newFile.uploadFile = file;
                newFile.uploadFn = File.upload($scope.myModelObj, file)
                    .progress(function (evt) {
                        newFile.uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
                        newFile.uploadFile.isComplete = newFile.uploadFile.percent === 100;
                    }).success(function (data) {
                        // file is uploaded successfully
                        $scope.expression[Uris.QA_HAS_FILE].push(data.uri);

                        // Set the transcript
                        // expression[Uris.QA_HAS_TRANSCRIPT] = data.uri;
                        $scope.expression[Uris.QA_EXTERNAL_LOCATION].push(Uris.SESAME_FILE_ROOT + data[Uris.QA_SYSTEM_LOCATION]);

                        // expression.$file = File.setupImageUrls(data);
                        // {"uri":"http://qldarch.net/users/amuys/DigitalFile#70211253214","http://qldarch.net/ns/rdf/2012-06/terms#managedFile":true,"http://qldarch.net/ns/rdf/2012-06/terms#basicMimeType":"text/plain","http://qldarch.net/ns/rdf/2012-06/terms#dateUploaded":1398229653214,"http://qldarch.net/ns/rdf/2012-06/terms#sourceFilename":"91f43085d59092db9ed9c59bac06ffa2.txt","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":"http://qldarch.net/ns/rdf/2012-06/terms#DigitalFile","http://qldarch.net/ns/rdf/2012-06/terms#transcriptFile":"amuys/transcript/amuys-1398229653098-91f43085d59092db9ed9c59bac06ffa2.txt.json","http://qldarch.net/ns/rdf/2012-06/terms#uploadedBy":"http://qldarch.net/users/amuys","http://qldarch.net/ns/rdf/2012-06/terms#hasFileSize":39724,"http://qldarch.net/ns/rdf/2012-06/terms#systemLocation":"amuys/amuys-1398229653072-91f43085d59092db9ed9c59bac06ffa2.txt"}
                    });
                // $scope.expression.$files.push(file);
            });
        };

        $scope.onTranscriptFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            angular.forEach($files, function (file) {
                console.log('file', file);
                // Create an expression for each files
                var newFile = {};
                $scope.expression.$audioFiles.unshift(newFile);
                newFile.uploadFile = file;
                newFile.uploadFn = File.upload($scope.myModelObj, file)
                    .progress(function (evt) {
                        newFile.uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
                        newFile.uploadFile.isComplete = newFile.uploadFile.percent === 100;
                    }).success(function (data) {
                        // file is uploaded successfully
                        $scope.expression[Uris.QA_HAS_FILE].push(data.uri);

                        // Set the transcript
                        // expression[Uris.QA_HAS_TRANSCRIPT] = data.uri;
                        $scope.expression[Uris.QA_EXTERNAL_LOCATION] = Uris.SESAME_FILE_ROOT + data[Uris.QA_SYSTEM_LOCATION];

                        // expression.$file = File.setupImageUrls(data);
                        // {"uri":"http://qldarch.net/users/amuys/DigitalFile#70211253214","http://qldarch.net/ns/rdf/2012-06/terms#managedFile":true,"http://qldarch.net/ns/rdf/2012-06/terms#basicMimeType":"text/plain","http://qldarch.net/ns/rdf/2012-06/terms#dateUploaded":1398229653214,"http://qldarch.net/ns/rdf/2012-06/terms#sourceFilename":"91f43085d59092db9ed9c59bac06ffa2.txt","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":"http://qldarch.net/ns/rdf/2012-06/terms#DigitalFile","http://qldarch.net/ns/rdf/2012-06/terms#transcriptFile":"amuys/transcript/amuys-1398229653098-91f43085d59092db9ed9c59bac06ffa2.txt.json","http://qldarch.net/ns/rdf/2012-06/terms#uploadedBy":"http://qldarch.net/users/amuys","http://qldarch.net/ns/rdf/2012-06/terms#hasFileSize":39724,"http://qldarch.net/ns/rdf/2012-06/terms#systemLocation":"amuys/amuys-1398229653072-91f43085d59092db9ed9c59bac06ffa2.txt"}
                    });
                // $scope.expression.$files.push(file);
            });
        };

        $scope.create = function (expression) {
            Expression.create(expression);
        };
        // $scope.cancelUpload = function (expression) {
        //     // Remove the expression
        //     var index = $scope.expressions.indexOf(expression);
        //     $scope.expressions.splice(index, 1);

        //     // Cancel the upload
        //     expression.$upload.cancel();
        // };


        /*
        =====================================================
            Select2 Boxes
        =====================================================
         */

        /**
         * Clears the cache for the select so
         * that if a new person is added, the select is refreshed with the newly added list.
         *
         * @return {} [description]
         */
        $scope.clearSelectCache = function () {
            $cacheFactory.get('$http').remove('/ws/rest/entity/detail/qldarch%3ANonDigitalThing?INCSUBCLASS=true&');
        };

        // Update our model when the selected interviewers change
        $scope.$watch('selectedInterviewees', function (selectedInterviewees) {
            $scope.expression[Uris.QA_INTERVIEWEE] = [];
            angular.forEach(selectedInterviewees, function (interviewee) {
                $scope.expression[Uris.QA_INTERVIEWEE].push(interviewee.uri);
            });
        });

        $scope.$watch('selectedInterviewers', function (selectedInterviewers) {
            $scope.expression[Uris.QA_INTERVIEWER] = [];
            angular.forEach(selectedInterviewers, function (interviewer) {
                $scope.expression[Uris.QA_INTERVIEWER].push(interviewer.uri);
            });
        });

        // Setup the entity select boxes
        $scope.personSelect = {
            placeholder: 'Select a Person',
            dropdownAutoWidth: true,
            multiple: true,
            minimumInputLength: 2,
            query: function (options) {
                console.log('querying!');
                Entity.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: []
                    };
                    angular.forEach(entities, function (entity) {
                        var types = GraphHelper.asArray(entity[Uris.RDF_TYPE]);
                        if (types.indexOf(Uris.QA_ARCHITECT_TYPE) || types.indexOf(Uris.FOAF_PERSON_TYPE)) {

                        }
                        data.results.unshift(entity);
                    });
                    options.callback(data);
                });
            }
        };

    });