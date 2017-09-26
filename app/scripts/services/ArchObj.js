'use strict';

angular.module('qldarchApp').factory('ArchObj', function($http, $cacheFactory, $q, Uris, RelationshipLabels, toaster, CreateRelationship) {
  /* globals $:false */
  var path = Uris.WS_ROOT + 'archobj/';

  function getStartTime(exchange) {
    if (!exchange.time) {
      return 0;
    }
    return exchange.time;
  }

  function isLastExchange(exchange, exchanges) {
    return exchanges.indexOf(exchange) === exchanges.length - 1;
  }

  function nextExchange(exchange, exchanges) {
    var nextIndex = exchanges.indexOf(exchange) + 1;
    if (nextIndex >= exchanges.length) {
      throw new Error('Can\'t find next exchange');
    }
    return exchanges[nextIndex];
  }

  function getEndTime(exchange, exchanges) {
    if (isLastExchange(exchange, exchanges)) {
      exchange.endTime = 999999;
      return exchange.endTime;
    }
    return nextExchange(exchange, exchanges).time;
  }

  // Public API here
  var archobj = {
    clearAll : function() {
      $cacheFactory.get('$http').removeAll();
    },

    createArchitect : function(data) {
      var payload = angular.copy(data);
      payload.label = payload.firstname + ' ' + payload.lastname;
      payload.architect = true;
      // Remove any extra information
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      // delete payload.firstname;
      // delete payload.lastname;
      // delete payload.preflabel;
      // delete payload.practicedinqueensland;
      // delete payload.architect;
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
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created');
        console.log('created architect id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    updateArchitect : function(data) {
      var payload = angular.copy(data);
      // Remove any extra information
      delete payload.architect;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.label;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      // delete payload.version;
      // delete payload.type;
      // delete payload.firstname;
      // delete payload.lastname;
      // delete payload.preflabel;
      // delete payload.practicedinqueensland;
      // delete payload.summary;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated');
        console.log('updated architect id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    createFirm : function(data) {
      var payload = angular.copy(data);
      if (payload.$employedArchitects !== null && angular.isDefined(payload.$employedArchitects)) {
        payload.employees = [];
        angular.forEach(payload.$employedArchitects, function(architect) {
          payload.employees.push(architect.id);
        });
      }
      if (!(payload.start instanceof Date)) {
        payload.start = new Date(payload.start);
      }
      var startdate = '0' + payload.start.getDate();
      var startmonth = '0' + (payload.start.getMonth() + 1);
      var startyear = payload.start.getFullYear();
      if (!(isNaN(startdate) || isNaN(startmonth) || isNaN(startyear))) {
        var fixedStartDate = startyear + '-' + startmonth + '-' + startdate;
        payload.start = fixedStartDate;
      } else {
        delete payload.start;
      }
      if (!(payload.end instanceof Date)) {
        payload.end = new Date(payload.end);
      }
      var enddate = '0' + payload.end.getDate();
      var endmonth = '0' + (payload.end.getMonth() + 1);
      var endyear = payload.end.getFullYear();
      if (!(isNaN(enddate) || isNaN(endmonth) || isNaN(endyear))) {
        var fixedEndDate = endyear + '-' + endmonth + '-' + enddate;
        payload.end = fixedEndDate;
      } else {
        delete payload.end;
      }
      if (payload.$precededByFirms !== null && angular.isDefined(payload.$precededByFirms)) {
        payload.precededby = payload.$precededByFirms.id;
      }
      if (payload.$succeededByFirms !== null && angular.isDefined(payload.$succeededByFirms)) {
        payload.succeededby = payload.$succeededByFirms.id;
      }
      // Remove any extra information
      delete payload.$employedArchitects;
      delete payload.$precededByFirms;
      delete payload.$succeededByFirms;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      // delete payload.australian;
      // delete payload.start;
      // delete payload.end;
      // delete payload.precededby;
      // delete payload.succeededby;
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
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created');
        console.log('created firm id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    updateFirm : function(data) {
      var payload = angular.copy(data);
      if (!(payload.start instanceof Date)) {
        payload.start = new Date(payload.start);
      }
      var startdate = '0' + payload.start.getDate();
      var startmonth = '0' + (payload.start.getMonth() + 1);
      var startyear = payload.start.getFullYear();
      if (!(isNaN(startdate) || isNaN(startmonth) || isNaN(startyear))) {
        var fixedStartDate = startyear + '-' + startmonth + '-' + startdate;
        payload.start = fixedStartDate;
      } else {
        delete payload.start;
      }
      if (!(payload.end instanceof Date)) {
        payload.end = new Date(payload.end);
      }
      var enddate = '0' + payload.end.getDate();
      var endmonth = '0' + (payload.end.getMonth() + 1);
      var endyear = payload.end.getFullYear();
      if (!(isNaN(enddate) || isNaN(endmonth) || isNaN(endyear))) {
        var fixedEndDate = endyear + '-' + endmonth + '-' + enddate;
        payload.end = fixedEndDate;
      } else {
        delete payload.end;
      }
      if (payload.$precededByFirms !== null && angular.isDefined(payload.$precededByFirms)) {
        payload.precededby = payload.$precededByFirms.id;
      }
      if (payload.$succeededByFirms !== null && angular.isDefined(payload.$succeededByFirms)) {
        payload.succeededby = payload.$succeededByFirms.id;
      }
      // Remove any extra information
      delete payload.$precededByFirms;
      delete payload.$succeededByFirms;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      // delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.australian;
      // delete payload.summary;
      // delete payload.start;
      // delete payload.end;
      // delete payload.precededby;
      // delete payload.succeededby;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated');
        console.log('updated firm id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    createStructure : function(data) {
      var payload = angular.copy(data);
      if (payload.$typologies !== null && angular.isDefined(payload.$typologies)) {
        payload.typologies = [];
        angular.forEach(payload.$typologies, function(typology) {
          payload.typologies.push(typology.text);
        });
      }
      var relationships = [];
      if (payload.$associatedFirm !== null && angular.isDefined(payload.$associatedFirm)) {
        angular.forEach(payload.$associatedFirm, function(firm) {
          relationships.push(firm.id);
        });
      }
      if (payload.$associatedArchitects !== null && angular.isDefined(payload.$associatedArchitects)) {
        angular.forEach(payload.$associatedArchitects, function(architect) {
          relationships.push(architect.id);
        });
      }
      if (!(payload.completion instanceof Date)) {
        payload.completion = new Date(payload.completion);
      }
      var date = '0' + payload.completion.getDate();
      var month = '0' + (payload.completion.getMonth() + 1);
      var year = payload.completion.getFullYear();
      if (!(isNaN(date) || isNaN(month) || isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date;
        payload.completion = fixedDate;
      } else {
        delete payload.completion;
      }
      // Remove any extra information
      delete payload.$associatedFirm;
      delete payload.$associatedArchitects;
      delete payload.$typologies;
      delete payload.associatedEntities;
      delete payload.lat;
      delete payload.lon;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.typologies;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      // delete payload.location;
      // delete payload.completion;
      // delete payload.latitude;
      // delete payload.longitude;
      // delete payload.australian;
      // delete payload.demolished;
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
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created');
        console.log('created structure id: ' + data.id);
        if (relationships.length > 0) {
          var promises = [];
          angular.forEach(relationships, function(r) {
            var relationship = {};
            relationship.$source = 'structure';
            relationship.$type = {
              id : 'WorkedOn'
            };
            relationship.$subject = {
              id : r
            };
            relationship.$object = {
              id : data.id
            };
            var promise = CreateRelationship.createRelationship(relationship).then(function(rsp) {
              return rsp;
            }, function(rsp) {
              return rsp;
            });
            promises.push(promise);
          });
          $q.all(promises).then(function() {
            toaster.pop('success', 'Associated entities added');
            return data;
          });
        } else {
          return data;
        }
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    updateStructure : function(data) {
      var payload = angular.copy(data);
      if (payload.$typologies !== null && angular.isDefined(payload.$typologies)) {
        payload.typologies = [];
        angular.forEach(payload.$typologies, function(typology) {
          payload.typologies.push(typology.text);
        });
      }
      var relationships = [];
      if (payload.$associatedFirm !== null && angular.isDefined(payload.$associatedFirm)) {
        angular.forEach(payload.$associatedFirm, function(firm) {
          relationships.push(firm.id);
        });
      }
      if (payload.$associatedArchitects !== null && angular.isDefined(payload.$associatedArchitects)) {
        angular.forEach(payload.$associatedArchitects, function(architect) {
          relationships.push(architect.id);
        });
      }
      if (!(payload.completion instanceof Date)) {
        payload.completion = new Date(payload.completion);
      }
      var date = '0' + payload.completion.getDate();
      var month = '0' + (payload.completion.getMonth() + 1);
      var year = payload.completion.getFullYear();
      if (!(isNaN(date) || isNaN(month) || isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date;
        payload.completion = fixedDate;
      } else {
        delete payload.completion;
      }
      // Remove any extra information
      delete payload.$associatedFirm;
      delete payload.$associatedArchitects;
      delete payload.$typologies;
      delete payload.associatedEntities;
      delete payload.lat;
      delete payload.lon;
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      // delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.australian;
      // delete payload.summary;
      // delete payload.location;
      // delete payload.completion;
      // delete payload.latitude;
      // delete payload.longitude;
      // delete payload.demolished;
      // delete payload.typologies;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated');
        console.log('updated structure id: ' + data.id);
        if (relationships.length > 0 || data.associatedEntities.length > 0) {
          var promises = [];
          if (relationships.length > 0) {
            angular.forEach(relationships, function(r) {
              var newrelationship = true;
              angular.forEach(data.associatedEntities, function(e) {
                if (e.id === r) {
                  newrelationship = false;
                }
              });
              if (newrelationship) {
                var relationship = {};
                relationship.$source = 'structure';
                relationship.$type = {
                  id : 'WorkedOn'
                };
                relationship.$subject = {
                  id : r
                };
                relationship.$object = {
                  id : data.id
                };
                var promise = CreateRelationship.createRelationship(relationship).then(function(rsp) {
                  return rsp;
                }, function(rsp) {
                  return rsp;
                });
                promises.push(promise);
              }
            });
          }
          if (data.associatedEntities.length > 0) {
            angular.forEach(data.associatedEntities, function(e) {
              var entityexist = false;
              angular.forEach(relationships, function(rel) {
                if (e.id === rel) {
                  entityexist = true;
                }
              });
              if (!entityexist) {
                var promise = $http.delete(Uris.WS_ROOT + 'relationship/' + e.relationshipid, {
                  withCredentials : true
                }).then(function(rsp) {
                  return rsp;
                }, function(rsp) {
                  return rsp;
                });
                promises.push(promise);
              }
            });
          }
          $q.all(promises).then(function() {
            toaster.pop('success', 'Associated entities updated');
            return data;
          });
        } else {
          return data;
        }
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    createArticle : function(data) {
      var payload = angular.copy(data);
      if (!(payload.published instanceof Date)) {
        payload.published = new Date(payload.published);
      }
      var date = '0' + payload.published.getDate();
      var month = '0' + (payload.published.getMonth() + 1);
      var year = payload.published.getFullYear();
      if (!(isNaN(date) || isNaN(month) || isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date;
        payload.published = fixedDate;
      } else {
        delete payload.published;
      }
      // Remove any extra information
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.authors;
      // delete payload.periodical;
      // delete payload.volume;
      // delete payload.issue;
      // delete payload.published;
      // delete payload.pages;
      // delete payload.summary;
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
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created');
        console.log('created article id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    updateArticle : function(data) {
      var payload = angular.copy(data);
      if (!(payload.published instanceof Date)) {
        payload.published = new Date(payload.published);
      }
      var date = '0' + payload.published.getDate();
      var month = '0' + (payload.published.getMonth() + 1);
      var year = payload.published.getFullYear();
      if (!(isNaN(date) || isNaN(month) || isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date;
        payload.published = fixedDate;
      } else {
        delete payload.published;
      }
      // Remove any extra information
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.label;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      // delete payload.version;
      // delete payload.type;
      // delete payload.authors;
      // delete payload.periodical;
      // delete payload.volume;
      // delete payload.issue;
      // delete payload.published;
      // delete payload.pages;
      // delete payload.summary;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated');
        console.log('updated article id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    createInterview : function(data) {
      var payload = angular.copy(data);
      if (!(payload.created instanceof Date)) {
        payload.created = new Date(payload.created);
      }
      var date = '0' + payload.created.getDate();
      var month = '0' + (payload.created.getMonth() + 1);
      var year = payload.created.getFullYear();
      if (!(isNaN(date) || isNaN(month) || isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date;
        payload.created = fixedDate;
      } else {
        delete payload.created;
      }
      payload.type = 'interview';
      payload.label = payload.$interviewees[0].text + ' interview';
      if (payload.$interviewees !== null && angular.isDefined(payload.$interviewees)) {
        payload.interviewee = [];
        angular.forEach(payload.$interviewees, function(interviewee) {
          payload.interviewee.push(interviewee.id);
        });
      }
      if (payload.$interviewers !== null && angular.isDefined(payload.$interviewers)) {
        payload.interviewer = [];
        angular.forEach(payload.$interviewers, function(interviewer) {
          payload.interviewer.push(interviewer.id);
        });
      }
      // Remove any extra information
      delete payload.$interviewees;
      delete payload.$interviewers;
      delete payload.$youtubeUrl;
      delete payload.id;
      delete payload.media;
      delete payload.locked;
      delete payload.owner;
      delete payload.relationships;
      delete payload.associatedMedia;
      delete payload.transcript;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.interviewee;
      // delete payload.interviewer;
      // delete payload.location;
      // delete payload.created;
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
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created');
        console.log('created interview id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    updateInterview : function(data) {
      var payload = angular.copy(data);
      if (!(payload.created instanceof Date)) {
        payload.created = new Date(payload.created);
      }
      var date = '0' + payload.created.getDate();
      var month = '0' + (payload.created.getMonth() + 1);
      var year = payload.created.getFullYear();
      if (!(isNaN(date) || isNaN(month) || isNaN(year))) {
        var fixedDate = year + '-' + month + '-' + date;
        payload.created = fixedDate;
      } else {
        delete payload.created;
      }
      if (payload.$interviewees !== null && angular.isDefined(payload.$interviewees)) {
        payload.interviewee = [];
        angular.forEach(payload.$interviewees, function(interviewee) {
          payload.interviewee.push(interviewee.id);
        });
      }
      if (payload.$interviewers !== null && angular.isDefined(payload.$interviewers)) {
        payload.interviewer = [];
        angular.forEach(payload.$interviewers, function(interviewer) {
          payload.interviewer.push(interviewer.id);
        });
      }
      // Remove any extra information
      delete payload.$interviewees;
      delete payload.$interviewers;
      delete payload.$youtubeUrl;
      delete payload.id;
      delete payload.label;
      delete payload.media;
      delete payload.locked;
      delete payload.owner;
      delete payload.relationships;
      delete payload.associatedMedia;
      delete payload.transcript;
      // delete payload.version;
      // delete payload.type;
      // delete payload.interviewee;
      // delete payload.interviewer;
      // delete payload.location;
      // delete payload.created;
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated');
        console.log('updated interview id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    createOther : function(data) {
      var payload = angular.copy(data);
      if (payload.$type !== null && angular.isDefined(payload.$type)) {
        payload.type = payload.$type.id;
      }
      delete payload.$type;
      // Remove any extra information
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      console.log(payload);
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
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' created');
        console.log('created other id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    updateOther : function(data) {
      var payload = angular.copy(data);
      console.log(data);
      if (payload.$type !== null && angular.isDefined(payload.$type)) {
        payload.type = payload.$type.id;
      }
      delete payload.$type;
      // Remove any extra information
      delete payload.locked;
      delete payload.associatedMedia;
      delete payload.created;
      delete payload.id;
      delete payload.interviews;
      delete payload.media;
      delete payload.owner;
      delete payload.relationships;
      // delete payload.version;
      // delete payload.type;
      // delete payload.label;
      // delete payload.summary;
      console.log(payload);
      return $http({
        method : 'POST',
        url : path + data.id,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        withCredentials : true,
        transformRequest : function(obj) {
          return $.param(obj, true);
        },
        data : payload
      }).then(function(response) {
        angular.extend(data, response.data);
        toaster.pop('success', data.label + ' updated');
        console.log('updated other id: ' + data.id);
        return data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    delete : function(id) {
      return $http.delete(path + id, {
        withCredentials : true
      }).then(function(response) {
        toaster.pop('success', response.data.label + ' deleted');
        console.log('deleted archive object id: ' + response.data.id);
        return response.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    load : function(id) {
      return $http.get(path + id).then(function(result) {
        console.log('load archive object id: ' + id);
        return result.data;
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    loadWithRelationshipLabels : function(id) {
      return $http.get(path + id).then(function(result) {
        console.log('load with relationship labels for archive object id: ' + id);
        return RelationshipLabels.load().then(function(response) {
          angular.forEach(result.data.relationships, function(relationship) {
            if (response.hasOwnProperty(relationship.relationship)) {
              relationship.relationship = response[relationship.relationship];
            }
          });
          return result.data;
        });
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    },

    loadInterviewObj : function(interviewId) {
      return $http.get(path + interviewId).then(function(result) {
        console.log('load interview object id: ' + interviewId);
        return RelationshipLabels.load().then(function(response) {
          angular.forEach(result.data.transcript, function(exchange) {
            exchange.startTime = getStartTime(exchange);
            exchange.endTime = getEndTime(exchange, result.data.transcript);
            if (exchange.hasOwnProperty('relationships')) {
              angular.forEach(exchange.relationships, function(relationship) {
                if (response.hasOwnProperty(relationship.relationship)) {
                  relationship.relationship = response[relationship.relationship];
                }
              });
            }
          });
          return result.data;
        });
      }, function(response) {
        toaster.pop('error', 'Error occured', response.data.msg);
        console.log('error message: ' + response.data.msg);
      });
    }
  };

  return archobj;
});