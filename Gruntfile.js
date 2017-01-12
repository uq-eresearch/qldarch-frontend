'use strict';

// split Gruntfile as described here: http://stackoverflow.com/a/25343117
module.exports = function(grunt) {
  // Initialize config.
  grunt.initConfig({
    pkg : require('./package.json'),
  });

  // Load per-task config from separate files.
  grunt.loadTasks('tasks');
};