'use strict';

angular.module('qldarchApp').service('BuildingTypologyMarkers', function() {
  /* globals L:false */
  var redMoney = L.AwesomeMarkers.icon({
    icon : 'money',
    prefix : 'fa',
    markerColor : 'red'
  });
  var orangeHome = L.AwesomeMarkers.icon({
    icon : 'home',
    prefix : 'fa',
    markerColor : 'orange'
  });
  var blueGraduation = L.AwesomeMarkers.icon({
    icon : 'graduation-cap ',
    prefix : 'fa',
    markerColor : 'blue'
  });
  var darkblueUniversity = L.AwesomeMarkers.icon({
    icon : 'university',
    prefix : 'fa',
    markerColor : 'darkblue'
  });
  var greenHSquare = L.AwesomeMarkers.icon({
    icon : 'h-square',
    prefix : 'fa',
    markerColor : 'green'
  });
  var purpleIndustry = L.AwesomeMarkers.icon({
    icon : 'industry',
    prefix : 'fa',
    markerColor : 'purple'
  });
  var darkgreenPicture = L.AwesomeMarkers.icon({
    icon : 'picture-o',
    prefix : 'fa',
    markerColor : 'darkgreen'
  });
  var cadetblueSnowflake = L.AwesomeMarkers.icon({
    icon : 'snowflake-o',
    prefix : 'fa',
    markerColor : 'cadetblue'
  });
  var blackRoad = L.AwesomeMarkers.icon({
    icon : 'road',
    prefix : 'fa',
    markerColor : 'black'
  });
  return {
    'Commercial buildings' : redMoney,
    'Dwellings' : orangeHome,
    'Educational facilities' : blueGraduation,
    'Government buildings' : darkblueUniversity,
    'Health care facilities' : greenHSquare,
    'Industrial buildings' : purpleIndustry,
    'Recreation and sports facilities' : darkgreenPicture,
    'Religious buildings' : cadetblueSnowflake,
    'Transport infrastructure' : blackRoad
  };
});