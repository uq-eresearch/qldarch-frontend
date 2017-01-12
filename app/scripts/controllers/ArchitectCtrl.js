'use strict';

angular.module('qldarchApp').controller('ArchitectCtrl', function ($scope, types, architect, interviews, $http, $state, Uris, Entity) {

  $scope.architect = architect;
  $scope.interviews = interviews;

  function goToTypePage(typeUri) {
    if (typeUri === Uris.QA_ARCHITECT_TYPE) {
      $state.go('architect.summary', {
        architectId: architect.encodedUri
      });
    } else if (typeUri === Uris.QA_FIRM_TYPE) {
      $state.go('firm.summary', {
        firmId: architect.encodedUri
      });
    } else if (typeUri === Uris.QA_STRUCTURE_TYPE) {
      $state.go('structure.summary', {
        structureId: architect.encodedUri
      });
    } else {
      $state.go('other.summary', {
        otherId: architect.encodedUri
      });
    }
  }
  $scope.updateArchitect = function (architect) {
    if (architect.uri) {
      // PUT
      Entity.update(architect.uri, architect).
      catch (function (error) {
        alert('Failed to save');
        console.log('Failed to save', error);
        $state.go('architect.summary.edit', {
          architectId: architect.encodedUri
        });
      });
      goToTypePage($scope.architect[Uris.RDF_TYPE]);
    } else {
      // POST
      console.log('architect', architect);

      Entity.create(architect, Uris.QA_ARCHITECT_TYPE).then(function () {
        goToTypePage($scope.architect[Uris.RDF_TYPE]);
      });
    }
  };



  $scope.cancel = function () {
    if (architect.uri) {
      $state.go('architect.summary');
    } else {
      $state.go('architects.queensland');
    }
  };

  /**
   * ======================================================
   * 
   * Select Box for Types
   * 
   * ======================================================
   */
  $scope.architect.$type = null;
  angular.forEach(types, function (type) {
    if (type.uri === Uris.QA_ARCHITECT_TYPE) {
      $scope.architect.$type = {
          id: type.uri,
          uri: type.uri,
          text: type[Uris.QA_LABEL],
          name: type[Uris.QA_LABEL],
          encodedUri: type.encodedUri,
      };
    }
  });
  $scope.$watch('architect.$type', function (type) {
    // Delete all typologies on the structure
    if (type) {
      $scope.architect[Uris.RDF_TYPE] = type.uri;
    }
  });
  $scope.typeSelect = {
      placeholder: 'Select a Type',
      dropdownAutoWidth: true,
      multiple: false,
      query: function (options) {
        var data = {
            results: []
        };
        angular.forEach(types, function (type) {
          if (type.uri !== Uris.QA_BUILDING_TYPOLOGY && type[Uris.QA_LABEL].toLowerCase().indexOf(options.term.toLowerCase()) !== -1) {
            data.results.push({
              id: type.uri,
              uri: type.uri,
              text: type[Uris.QA_LABEL],
              name: type[Uris.QA_LABEL],
              encodedUri: type.encodedUri,
            });
          }
        });
        options.callback(data);
      }
  };
});