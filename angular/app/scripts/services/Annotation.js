'use strict';

angular.module('angularApp')
	.factory('Annotation', function (Request, Uris, GraphHelper) {
		// Service logic
		// ...

		var meaningOfLife = 42;

		// Public API here
		return {
			findForInterviewUri: function (interviewUri) {
				return Request.http(Uris.JSON_ROOT + "annotation", {
					"RESOURCE": interviewUri,
					"TIME": 0,
					"DURATION": "99999"
				}).then(function(annotations) {

					// Setup the subject, predicate, objects

				})
			}
		};
	});
