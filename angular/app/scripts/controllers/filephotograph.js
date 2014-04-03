'use strict';

angular.module('angularApp')
    .controller('FilePhotographCtrl', function ($scope, $upload, Uris, $http) {

        $scope.expressions = [];

        $scope.onFileSelect = function ($files) {

            //$files: an array of files selected, each file has name, size, and type.
            angular.forEach($files, function (file) {
                console.log('file', file);
                // Create an expression for each file
                var expression = {};
                expression.$uploadFile = file;
                expression[Uris.DCT_TITLE] = file.name;
                expression[Uris.RDF_TYPE] = 'http://qldarch.net/ns/rdf/2012-06/terms#Photograph';
                expression[Uris.QA_DEPICTS_BUILDING] = 'http://qldarch.net/users/cking/Structure#61816694616';
                // expression[Uris.QA_DEPICTS_BUILDING] = 'http://qldarch.net/users/cking/Structure#61816694616';
                $scope.expressions.push(expression);

                expression.$upload = $upload.upload({
                    url: Uris.JSON_ROOT + 'file/user', //upload.php script, node.js route, or servlet url
                    // method: POST or PUT,
                    // headers: {'header-key': 'header-value'},
                    // withCredentials: true,
                    data: {
                        myObj: $scope.myModelObj
                    },
                    file: file, // or list of files: $files for html5 only
                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                    //formDataAppender: function(formData, key, val){}
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    expression.$uploadFile.percent = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    // file is uploaded successfully
                    expression[Uris.QA_HAS_FILE] = data.uri;
                    console.log('complete', expression);
                });
            });
            /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };

        $scope.cancelUpload = function (expression) {
            // Cancel the upload
            expression.$upload.cancel();

            // Remove the expression
            var index = $scope.expressions.indexOf(expression);
            $scope.expressions.splice(index, 1);
        };

        $scope.saveExpression = function (expression) {
            $http.post(Uris.JSON_ROOT + 'expression/description', expression).then(function (response) {
                console.log('response', response);
            });
        };
    });