'use strict';

angular.module('qldarchApp').controller('RelationshipsCreateCtrl', function($scope, $http, Uris, toaster, types, $filter, entities, $state, ArchObj) {
  /* globals $:false */
  $scope.relationship = {};

  var sourcetypes = [ {
    id : 'interview',
    text : 'Interview'
  }, {
    id : 'structure',
    text : 'Structure'
  } ];

  $scope.relationshipsourceSelect = {
    placeholder : 'Select a Relationship Source',
    dropdownAutoWidth : true,
    multiple : false,
    data : sourcetypes
  };

  var relationshiptypes = {
    results : []
  };

  for ( var type in types) {
    relationshiptypes.results.push({
      id : type,
      text : types[type]
    });
  }

  $scope.relationshiptypeSelect = {
    placeholder : 'Select a Relationship Type',
    dropdownAutoWidth : true,
    multiple : false,
    data : relationshiptypes
  };

  entities = $filter('orderBy')(entities, function(entity) {
    return entity.label;
  });

  var dataEntitySelect = {
    results : []
  };

  angular.forEach(entities, function(e) {
    if (e.label && !(/\s/.test(e.label.substring(0, 1)))) {
      var entitytype = 'unknown';
      if (e.hasOwnProperty('type')) {
        entitytype = e.type.charAt(0).toUpperCase() + e.type.slice(1);
      } else if (e.hasOwnProperty('firstname') || e.hasOwnProperty('lastname')) {
        entitytype = 'Person';
      } else if (e.hasOwnProperty('lat') || e.hasOwnProperty('lng')) {
        entitytype = 'Structure';
      }
      dataEntitySelect.results.push({
        id : e.id,
        text : e.label + ' (' + entitytype + ')'
      });
    }
  });

  $scope.subjObjSelect = {
    placeholder : 'Select an Entity',
    dropdownAutoWidth : true,
    multiple : false,
    data : dataEntitySelect
  };

  var createRelationship = function(data) {
    var payload = angular.copy(data);
    payload.source = payload.$source.id;
    payload.type = payload.$type.id;
    payload.subject = payload.$subject.id;
    payload.object = payload.$object.id;
    delete payload.from;
    delete payload.until;
    if (payload.$from !== null && angular.isDefined(payload.$from) && payload.$from !== '') {
      payload.from = payload.$from.getFullYear();
    }
    if (payload.$until !== null && angular.isDefined(payload.$until) && payload.$until !== '') {
      payload.until = payload.$until.getFullYear();
    }
    // Remove any extra information
    delete payload.$source;
    delete payload.$type;
    delete payload.$subject;
    delete payload.$object;
    delete payload.$from;
    delete payload.$until;
    delete payload.id;
    delete payload.owner;
    delete payload.created;
    return $http({
      method : 'PUT',
      url : Uris.WS_ROOT + 'relationship',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      withCredentials : true,
      transformRequest : function(obj) {
        return $.param(obj);
      },
      data : payload
    }).then(function(response) {
      angular.extend(data, response.data);
      toaster.pop('success', data.id + ' relationship created.');
      console.log('created relationship id:' + data.id);
      return data;
    }, function() {
      toaster.pop('error', 'Error occured.', 'Sorry, we save at this time');
    });
  };

  function goToRelationships(archobjId, archobjType) {
    var params = {};
    if (archobjType === 'person') {
      params.architectId = archobjId;
      $state.go('architect.relationships', params);
    } else if (archobjType === 'firm') {
      params.firmId = archobjId;
      $state.go('firm.relationships', params);
    } else if (archobjType === 'structure') {
      params.structureId = archobjId;
      $state.go('structure.relationships', params);
    } else {
      params.otherId = archobjId;
      $state.go('other.relationships', params);
    }
  }

  $scope.createRelationship = function(relationship) {
    createRelationship(relationship);
    ArchObj.load(relationship.$subject.id).then(function(data) {
      goToRelationships(relationship.$subject.id, data.type);
    }).catch(function() {
      console.log('unable to load ArchObj');
      $state.go('main');
    });
  };

  $scope.cancel = function() {
    $state.go('main');
  };

});