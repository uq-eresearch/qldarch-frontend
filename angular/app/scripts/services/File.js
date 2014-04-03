'use strict';

angular.module('angularApp')
    .factory('File', function (Request, Uris) {

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
                console.log('setting up file', file.thumb);
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
            }
        };
    });