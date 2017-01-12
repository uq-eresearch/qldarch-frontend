module.exports = function(grunt) {
  grunt.config('jshint', {
    app : {
      src : [ 'app/scripts/**/*.js' ]
    },
    options : {
      jshintrc : '.jshintrc',
      reporter : require('jshint-stylish')
    },
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
};