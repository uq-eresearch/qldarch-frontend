'use strict';

angular.module('config', []).constant('ENV', {
  'name' : 'development',
  'apiEndpoint' : 'https://your-development.api.endpoint:3000'
});

angular.module('qldarchApp', [ 'config', 'ngCookies', 'ngResource', 'ngSanitize', 'ngAnimate', 'ngRoute', 'ngProgress', 'ui.bootstrap', 'ui.select2',
    'ui.map', 'audioPlayer', 'ui.utils', 'infinite-scroll', 'ui.router', 'angularFileUpload', 'toaster', 'vcRecaptcha', 'ui.tinymce' ]);