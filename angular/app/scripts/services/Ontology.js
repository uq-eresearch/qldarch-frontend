'use strict';

angular.module('angularApp')
	.factory('Ontology', function (Uris, Request) {
		// Service logic
		// ...

		var meaningOfLife = 42;

		var ontology = {
			/**
			 * Loads a single entity
			 * @param uri
			 * @returns {Promise | Summary object}
			 */
			loadProperty: function (uri) {
				return Request.http(Uris.JSON_ROOT + "ontology/properties", {}, true).then(function (properties) {
					return properties[uri];
				});
			},
			loadAllProperties: function () {
				return Request.http(Uris.JSON_ROOT + "ontology/properties", {}, true).then(function (properties) {
					return properties;
				});
			},
			findPropertyByName: function (name) {
				return ontology.loadAllProperties().then(function(properties) {
					var results = [];
					angular.forEach(properties, function (property, uri) {
						if (angular.isDefined(property[Uris.QA_ENTAILS_RELATIONSHIP])) {
							// its a relationship
							if (property[Uris.RDFS_LABEL].toLowerCase().indexOf(name.toLowerCase()) != -1) {
								results.push(property);
								property.name = property[Uris.RDFS_LABEL];
							}
						}
					});
					return results;
				})
			}
		};

		return ontology;
	});
