'use strict';

angular.module('angularApp')
    .controller('MainCtrl', function ($scope, $location, Uris, Entity, interviews, LayoutHelper, GraphHelper, compoundObjects, $upload) {
        $scope.searchType = 'entities';
        $scope.query = '';


        $scope.architectsStart = 0;
        $scope.architectsEnd = 1;
        var architectsPerRow = 5;

        // $scope.interviewRows = LayoutHelper.group(GraphHelper.graphValues(interviews), $scope.length);
        $scope.architectRows = LayoutHelper.group(GraphHelper.graphValues(interviews), architectsPerRow);

        $scope.nextArchitects = function () {
            $scope.architectsStart++;
            $scope.architectsEnd++;
        };
        $scope.prevArchitects = function () {
            $scope.architectsStart--;
            $scope.architectsEnd--;
        };


        $scope.compoundObjectsStart = 0;
        $scope.compoundObjectsEnd = 1;
        var compoundObjectsPerRow = 5;

        $scope.compoundObjectRows = LayoutHelper.group(compoundObjects, compoundObjectsPerRow);

        $scope.nextCompoundObjects = function () {
            $scope.compoundObjectsStart++;
            $scope.compoundObjectsEnd++;
        };
        $scope.prevCompoundObjects = function () {
            $scope.compoundObjectsStart--;
            $scope.compoundObjectsEnd--;
        };


        $scope.onFileSelect = function ($files) {
            $scope.upload = $upload.upload({
                url: Uris.JSON_ROOT + 'file/user', //upload.php script, node.js route, or servlet url
                // method: POST or PUT,
                // headers: {'header-key': 'header-value'},
                // withCredentials: true,
                data: {
                    myObj: $scope.myModelObj
                },
                file: $files[0], // or list of files: $files for html5 only
                /* set the file formData name ('Content-Desposition'). Default is 'file' */
                //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                //formDataAppender: function(formData, key, val){}
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data) {
                // }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
            });


            /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };
        // $scope.end = $scope.index + $scope.length;
        // $scope.prevArchitects = function () {
        //     $scope.index = Math.max($scope.index - $scope.length, 0);
        //     $scope.end = ($scope.index + $scope.length) % $scope.length;
        // };
        // $scope.nextArchitects = function () {
        //     $scope.index = Math.max($scope.index + $scope.length, $scope.architectRows.length);
        //     $scope.end = ($scope.index + $scope.length) % $scope.length;
        // };
        //		$scope.search = function(query) {
        //			console.log("searching",query, $scope.searchType);
        //			if($scope.searchType == "entities") {
        //				if(query && query.length) {
        //					// look up an entitiy
        //					Entity.findByName(query).then(function (entities) {
        //						console.log(entities);
        //						$scope.entities = entities;
        //					});
        //				}
        //			} else if($scope.searchType == "articles") {
        //				if(query && query.length) {
        //					$location.url("/search?query=" + query);
        //				}
        //			}
        //		}

    });