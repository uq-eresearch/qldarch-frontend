'use strict';

angular.module('qldarchApp').service('ArchObjTypes', function ArchObjTypes() {
  return {
    'article' : 'Article',
    'award' : 'Award',
    'education' : 'Education',
    'event' : 'Event',
    'firm' : 'Firm',
    'government' : 'Government',
    'interview' : 'Interview',
    'organisation' : 'Organisation',
    'person' : 'Person',
    'place' : 'Place',
    'publication' : 'Publication',
    'structure' : 'Structure',
    'topic' : 'Topic'
  };
});