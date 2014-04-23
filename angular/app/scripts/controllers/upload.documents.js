'use strict';

angular.module('angularApp')
    .controller('UploadDocumentsCtrl', function ($scope, $upload, Uris, $http, Structure, File, $state, $stateParams, Expression) {

        $scope.expressions = [];

        // var tempExpression = {};
        // tempExpression[Uris.DCT_TITLE] = 'file name';
        // tempExpression[Uris.RDF_TYPE] = 'http://qldarch.net/ns/rdf/2012-06/terms#Article';
        // $scope.expressions.push(tempExpression);

        // if ($stateParams.uri && $stateParams.name) {
        //     $scope.selectedProject = {
        //         id: $stateParams.uri,
        //         uri: $stateParams.uri,
        //         text: $stateParams.name,
        //         name: $stateParams.name,
        //         encodedUri: btoa($stateParams.uri)
        //     };
        // }

        // tempExpression[Uris.QA_DEPICTS_BUILDING] = 'http://qldarch.net/users/cking/Structure#61816694616';

        $scope.onFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            angular.forEach($files, function (file) {
                console.log('file', file);
                // Create an expression for each file
                var expression = {};
                expression.$article = {};
                expression.$interview = {};
                expression.$uploadFile = file;

                // Default type to articles
                expression[Uris.RDF_TYPE] = Uris.QA_ARTICLE_TYPE;

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
            });

            jQuery('html, body').animate({
                scrollTop: jQuery('#uploads').offset().top + 'px'
            }, 500, 'swing', function () {});
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
            // expression[Uris.QA_DEPICTS_BUILDING] = $scope.selectedProject.uri;
            // expression.$depicts = $scope.selectedProject;
            // var params = {};
            // params.structureId = $scope.selectedProject.encodedUri;
            // var uploadType;
            // if (expression[Uris.RDF_TYPE] === Uris.QA_LINEDRAWING_TYPE) {
            // uploadType = 'lineDrawings';
            // } else {
            // uploadType = 'photographs';
            // }
            // expression.$depictsLink = $state.href('structure' + '.' + uploadType, params);

            // // Post it
            // $http.post(Uris.JSON_ROOT + 'expression/description', expression).then(function (response) {
            //     console.log('response', response);
            //     angular.extend(expression, response.data);
            // });

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