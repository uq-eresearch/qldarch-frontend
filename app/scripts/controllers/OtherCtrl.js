'use strict';

angular.module('qldarchApp').controller('OtherCtrl', function ($scope, other, types, $state, Entity, Uris, GraphHelper) {
  $scope.other = other;
  if ($scope.other[Uris.FOAF_FIRST_NAME] || $scope.other[Uris.FOAF_LAST_NAME]) {
    $scope.other[Uris.QA_LABEL] = $scope.other[Uris.FOAF_FIRST_NAME] + ' ' + $scope.other[Uris.FOAF_LAST_NAME];
  }

  $scope.types = types;

  $scope.delete = function (other) {
    Entity.delete(other.uri, other).then(function () {
      // Success
      $state.go('main');
    }, function (reason) {
      // Failure
      console.log('Something went wrong', reason);
    });
  };

  function goToTypePage(typeUri) {
    if (typeUri === Uris.QA_ARCHITECT_TYPE) {
      $state.go('architect.summary', {
        architectId: other.encodedUri
      });
    } else if (typeUri === Uris.QA_FIRM_TYPE) {
      $state.go('firm.summary', {
        firmId: other.encodedUri
      });
    } else if (typeUri === Uris.QA_STRUCTURE_TYPE) {
      $state.go('structure.summary', {
        structureId: other.encodedUri
      });
    } else {
      $state.go('other.summary', {
        otherId: other.encodedUri
      });
    }
  }

  $scope.updateOther = function (other) {
    if (other.uri) {
      // PUT
      Entity.update(other.uri, other).
      catch (function (error) {
        alert('Failed to save');
        console.log('Failed to save', error);
        $state.go('other.summary.edit', {
          otherId: other.encodedUri
        });
      });

      goToTypePage($scope.other[Uris.RDF_TYPE]);
    } else {
      // POST
      Entity.create(other, other[Uris.RDF_TYPE]).then(function () {
        goToTypePage($scope.other[Uris.RDF_TYPE]);
      });
    }
  };

  $scope.cancel = function () {
    if (other.uri) {
      $state.go('other.summary');
    } else {
      $state.go('main');
    }
  };

  /**
   * ======================================================
   * 
   * Select Box for Types
   * 
   * ======================================================
   */
  $scope.other.$type = null;
  angular.forEach(types, function (type) {
    if (GraphHelper.asArray(other[Uris.RDF_TYPE]).indexOf(type.uri) !== -1) {
      $scope.other.$type = {
          id: type.uri,
          uri: type.uri,
          text: type[Uris.QA_LABEL],
          name: type[Uris.QA_LABEL],
          encodedUri: type.encodedUri,
      };
    }
  });
  $scope.$watch('other.$type', function (type) {
    // Delete all typologies on the structure
    if (type) {
      other[Uris.RDF_TYPE] = type.uri;
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