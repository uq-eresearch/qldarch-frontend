'use strict';

angular.module('angularApp')
    .controller('FilePhotographCtrl', function ($scope, $upload, Uris, $http, Structure, File, $state, $stateParams) {

        $scope.expressions = [];

        var tempExpression = {};
        tempExpression[Uris.DCT_TITLE] = 'file name';
        tempExpression[Uris.RDF_TYPE] = 'http://qldarch.net/ns/rdf/2012-06/terms#Photograph';

        if ($stateParams.uri && $stateParams.name) {
            $scope.selectedProject = {
                id: $stateParams.uri,
                uri: $stateParams.uri,
                text: $stateParams.name,
                name: $stateParams.name,
                encodedUri: btoa($stateParams.uri)
            };
        }

        tempExpression[Uris.QA_DEPICTS_BUILDING] = 'http://qldarch.net/users/cking/Structure#61816694616';
        // $scope.expressions.push(tempExpression);


        $scope.onFileSelect = function ($files) {

            //$files: an array of files selected, each file has name, size, and type.
            angular.forEach($files, function (file) {
                console.log('file', file);
                // Create an expression for each file
                var expression = {};
                expression.$uploadFile = file;
                expression[Uris.DCT_TITLE] = file.name;
                // Default type to photograph
                expression[Uris.RDF_TYPE] = 'http://qldarch.net/ns/rdf/2012-06/terms#Photograph';

                $scope.expressions.unshift(expression);

                expression.$upload = File.upload($scope.myModelObj, file)
                    .progress(function (evt) {
                        expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
                        expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
                    }).success(function (data) {
                        // file is uploaded successfully
                        expression[Uris.QA_HAS_FILE] = data.uri;
                        expression.$file = File.setupImageUrls(data);
                    });
                // expression.$upload = $upload.upload({
                //     url: Uris.JSON_ROOT + 'file/user', //upload.php script, node.js route, or servlet url
                //     // method: POST or PUT,
                //     // headers: {'header-key': 'header-value'},
                //     // withCredentials: true,
                //     data: {
                //         myObj: $scope.myModelObj
                //     },
                //     file: file, // or list of files: $files for html5 only
                //     /* set the file formData name ('Content-Desposition'). Default is 'file' */
                //     //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                //      customize how data is added to formData. See #40#issuecomment-28612000 for sample code 
                //     //formDataAppender: function(formData, key, val){}
                // }).progress(function (evt) {
                //     console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                //     expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
                //     expression.$uploadFile.isComplete = expression.$uploadFile.percent === 100;
                // }).then(function.success(function (data, status, headers, config) {
                //     // file is uploaded successfully
                //     expression[Uris.QA_HAS_FILE] = data.uri;
                //     expression.$file = data;
                //     console.log('complete', expression);
                // });
            });

            jQuery('html, body').animate({
                scrollTop: jQuery('#uploads').offset().top + 'px'
            }, 500, 'swing', function () {});

            /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };

        $scope.cancelUpload = function (expression) {

            // Remove the expression
            var index = $scope.expressions.indexOf(expression);
            $scope.expressions.splice(index, 1);

            // Cancel the upload
            expression.$upload.cancel();
        };

        $scope.publish = function (expression) {
            // Setup depicts
            expression[Uris.QA_DEPICTS_BUILDING] = $scope.selectedProject.uri;
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

            // Post it
            $http.post(Uris.JSON_ROOT + 'expression/description', expression).then(function (response) {
                console.log('response', response);
                angular.extend(expression, response.data);
            });
        };


        /*
        =====================================================
            Select2 Boxes
        =====================================================
         */
        $scope.$watch('selectedProject', function (project) {
            if (project && project.id === 'new') {
                $state.go('structure.summary.edit', {
                    structureId: null
                });
            }
        });

        // Setup the entity select boxes
        $scope.structureSelect = {
            placeholder: 'Select a Project',
            dropdownAutoWidth: true,
            multiple: false,
            // minimumInputLength: 2,
            query: function (options) {
                Structure.findByName(options.term, false).then(function (entities) {
                    var data = {
                        results: [{
                            id: 'new',
                            text: 'Create a new Project'
                        }]
                    };

                    angular.forEach(entities, function (entity) {
                        // if (entity.type === 'architect' || entity.type === 'firm' || entity.type === 'structure') {

                        var label = entity.name + ' (' + entity.type.charAt(0).toUpperCase() + entity.type.slice(1) + ')';
                        if (entity.type === 'structure') {
                            label = entity.name + ' (Project)';
                        }

                        data.results.unshift({
                            id: entity.uri,
                            uri: entity.uri,
                            text: label,
                            type: entity.type,
                            name: entity.name,
                            encodedUri: entity.encodedUri,
                            picture: entity.picture
                        });
                        // }
                    });
                    options.callback(data);
                });
            }
        };
    });