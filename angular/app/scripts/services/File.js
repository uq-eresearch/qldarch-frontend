'use strict';

angular.module('angularApp')
    .factory('File', function (Request, Uris, $upload) {

        function setupFileUrls(files) {
            angular.forEach(files, function (file) {

                var thumbRoot, fileRoot;
                if (file[Uris.QA_MANAGED_FILE]) {
                    // @todo: get thumbs working for sesame
                    // thumbs currenct just point to the full file
                    thumbRoot = Uris.SESAME_THUMB_ROOT;
                    fileRoot = Uris.SESAME_FILE_ROOT;
                } else {
                    thumbRoot = Uris.OMEKA_THUMB_ROOT;
                    fileRoot = Uris.OMEKA_FILE_ROOT;
                }

                file.file = fileRoot + file[Uris.QA_SYSTEM_LOCATION];
                file.thumb = thumbRoot + file[Uris.QA_SYSTEM_LOCATION];
            });
            return files;
        }

        // Public API here
        return {

            /**
             * Loads a single file
             * @param uri
             * @param type
             * @returns {*}
             */
            load: function (uri) {
                return Request.getUri('file', uri, true).then(function (file) {
                    return setupFileUrls([file])[0];
                });
            },

            /**
             * Loads all the files
             * @returns {Promise | Object}
             */
            loadAll: function () {
                return Request.getIndex('expression', 'qldarch:DigitalFile', true).then(function (files) {
                    return setupFileUrls(files);
                });
            },

            /**
             * Loads a list of files
             * @param uris
             * @param type
             * @returns {Promise | Object}
             */
            loadList: function (uris) {
                return Request.getIndexForUris('file', uris, true).then(function (files) {
                    return setupFileUrls(files);
                });
            },
            setupImageUrls: function (data) {
                return setupFileUrls([data])[0];
            },
            upload: function (data, file) {
                return $upload.upload({
                    url: Uris.JSON_ROOT + 'file/user', //upload.php script, node.js route, or servlet url
                    // method: POST or PUT,
                    // headers: {'header-key': 'header-value'},
                    // withCredentials: true,
                    data: {
                        myObj: data
                    },
                    file: file, // or list of files: $files for html5 only
                    /* set the file formData name ('Content-Desposition'). Default is 'file' */
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                    //formDataAppender: function(formData, key, val){}
                });
            }
        };
    });