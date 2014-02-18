'use strict';

angular.module('angularApp')
	.factory('File', function (Request) {
		// Service logic
		// ...

		var meaningOfLife = 42;

		// Public API here
		return {

			/**
			 * Loads a single file
			 * @param uri
			 * @param type
			 * @returns {*}
			 */
			load: function(uri) {
				return Request.getUri('file', uri, true);
			},

			/**
			 * Loads all the files
			 * @returns {Promise | Object}
			 */
			loadAll: function() {
				return Request.getIndex('expression', 'qldarch:DigitalFile', true);
			},

			/**
			 * Loads a list of files
			 * @param uris
			 * @param type
			 * @returns {Promise | Object}
			 */
			loadList: function(uris) {
				return Request.getIndexForUris('file', uris, true);
			}
		};
	});
