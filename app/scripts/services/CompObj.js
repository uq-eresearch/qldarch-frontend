'use strict';

angular.module('qldarchApp').factory('CompObj', function($http, $cacheFactory, Uris, RelationshipLabels, toaster) {
  /* globals $:false */
  var path = Uris.WS_ROOT + 'compobj/';

  // Public API here
  var compobj = {
    create : function(payload) {
      if (payload.type === 'timeline' && angular.isDefined(payload.dates) && payload.dates.length > 0) {
        payload.timelineevent = [];
        angular.forEach(payload.dates, function(date) {
          var startindex = date.asset.caption.indexOf('Id=') + 3;
          if (startindex > 71) {// Min string length to reach 'Id='
            var endindex = date.asset.caption.indexOf('">', startindex);
            date.archobj = date.asset.caption.substring(startindex, endindex);
          }
          delete date.asset;
          delete date.$selected;
          delete date.$$hashKey;
          payload.timelineevent.push(JSON.stringify(date));
        });
        delete payload.$tempDate;
        delete payload.dates;
      }
      if (payload.type === 'map' && angular.isDefined(payload.locations) && payload.locations.length > 0) {
        payload.structure = [];
        angular.forEach(payload.locations, function(location) {
          payload.structure.push(location.id);
        });
        delete payload.$markers;
        delete payload.locations;
      }
      if (payload.type === 'wordcloud' && angular.isDefined(payload.documents) && payload.documents.length > 0) {
        payload.wordcloud = [];
        angular.forEach(payload.documents, function(document) {
          delete document.created;
          delete document.location;
          delete document.label;
          delete document.id;
          delete document.category;
          delete document.type;
          delete document.$link;
          delete document.$selected;
          delete document.$$hashKey;
          payload.wordcloud.push(JSON.stringify(document));
        });
        delete payload.$stopWord;
        delete payload.documents;
      }
      delete payload.$import;
      delete payload.user;
      return $http({
        method : 'PUT',
        url : path,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        toaster.pop('success', response.data.title + ' created');
        console.log('created compound object id: ' + response.data.id);
        return response.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    delete : function(id) {
      return $http.delete(path + id, {
        withCredentials : true
      }).then(function(response) {
        toaster.pop('success', 'Compound object deleted');
        console.log('deleted compound object id: ' + response.data.id);
        return response.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    loadAll : function() {
      return $http.get(Uris.WS_ROOT + 'compobjs/all').then(function(result) {
        console.log('load all compound objects');
        return result.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    load : function(id) {
      return $http.get(path + id).then(function(result) {
        console.log('load compound object id: ' + id);
        return result.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    }
  };

  return compobj;
});