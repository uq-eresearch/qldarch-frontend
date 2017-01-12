module.exports = function(grunt) {
  var version = grunt.file.read('version.txt').split('\n')[0];
  grunt.config('clean', [ 'dist', '.tmp' ]);
  // Put files not handled in other tasks here
  grunt.config('copy', {
    // workaround: copy a fixed timeline.js into the bower_components directory
    timeline : {
      dest : 'app/bower_components/timelinejs/build/js/timeline.min.js',
      src : 'timeline.min.js'
    },
    dist : {
      files : [ {
        expand : true,
        dot : true,
        cwd : 'app',
        dest : 'dist',
        src : [ '*.{ico,png,txt}', '.htaccess', 'bower_components/angular-file-upload/dist/angular-file-upload-shim.min.js',
            'bower_components/jquery/jquery.min.js', 'bower_components/tinymce/tinymce.min.js',
            'bower_components/tinymce/plugins/paste/plugin.min.js', 'bower_components/tinymce/themes/modern/theme.min.js',
            'bower_components/angular/angular.min.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js', 'bower_components/timelinejs/**', // FIXME:
            // this
            // shouldnt
            // be
            // here
            'images/{,*/}*.{gif,webp}', 'images/header.jpg', 'fonts/*', 'resources/*', 'bower_components/tinymce/skins/lightgray/skin.min.css',
            'bower_components/tinymce/skins/lightgray/content.min.css', 'bower_components/tinymce/skins/lightgray/fonts/tinymce.woff',
            'bower_components/tinymce/skins/lightgray/fonts/tinymce.ttf', 'bower_components/ngprogress/ngProgress.css',
            'bower_components/select2/select2.css', 'bower_components/select2/select2.png',
            'bower_components/select2-bootstrap-css/select2-bootstrap.css', 'bower_components/AngularJS-Toaster/toaster.css',
            'bower_components/font-awesome/css/font-awesome.min.css', 'bower_components/font-awesome/fonts/fontawesome-webfont.woff',
            'bower_components/font-awesome/fonts/fontawesome-webfont.ttf' ]
      } ]
    },
    special : {
      files : [ {
        expand : true,
        dot : true,
        cwd : 'app',
        dest : 'dist',
        src : [ 'images/icon.png', 'images/header.jpg', ]
      } ]
    },
    styles : {
      expand : true,
      cwd : 'app/styles',
      dest : 'dist/styles/',
      src : '{,*/}*.css'
    },
    version : {
      src : 'version.txt',
      dest : 'dist/'
    }
  });
  // concat is auto configed by useminPrepare, run 'grunt --verbose
  // useminPrepare' to see configuration
  grunt.config('concat', {
    options : {
      process : function(src, filepath) {
        console.log(filepath);
        return '/* Source: ' + filepath + ' */\n' + src;
      }
    }
  });
  grunt.config('htmlmin', {
    dist : {
      options : {
      // removeComments: true,
      // collapseWhitespace: true
      },
      files : [ {
        expand : true,
        cwd : 'app',
        src : [ '*.html', 'views/**/*.html' ],
        dest : 'dist'
      } ]
    }
  });
  grunt.config('uglify', {
    options : {
      mangle : false,
      screwIE8 : false,
      exportAll : false
    },
  });
  grunt.config('cssmin', {
    options : {
      shorthandCompacting : false,
      roundingPrecision : -1
    }
  });
  grunt.config('useminPrepare', {
    html : 'app/index.html',
    options : {
      dest : 'dist'
    }
  });
  grunt.config('usemin', {
    html : 'dist/index.html'
  });
  grunt.config('ngconstant', {
    local : {
      options : {
        dest : 'app/scripts/config.js',
        name : 'config',
        space : '  ',
      },
      constants : {
        ENV : {
          name : 'local',
          apiEndpoint : 'http://your-development.api.endpoint:3000'
        }
      }
    },
    dev : {
      options : {
        dest : 'dist/scripts/config.js',
        name : 'config',
        space : '  ',
      },
      constants : {
        ENV : {
          name : 'development',
          apiEndpoint : 'http://your-development.api.endpoint:3000'
        }
      }
    },
    prod : {
      options : {
        dest : 'dist/scripts/config.js',
        name : 'config',
        space : '  ',
      },
      constants : {
        // '<constant name>': grunt.file.readJSON('<JSON file>')
        ENV : {
          name : 'production',
          apiEndpoint : 'go go go'
        }
      }
    }
  });
  grunt.config('imagemin', {
    dist : {
      files : [ {
        expand : true,
        cwd : 'app/images',
        src : '{,*/}*.{png,jpg,jpeg,svg}',
        dest : 'dist/images'
      } ],
      cache : false
    }
  });
  grunt.config('rev', {
    dist : {
      files : {
        src : [ 'dist/scripts/{,*/}*.js', 'dist/styles/{,*/}*.css', ]
      }
    }
  });
  grunt.config('autoprefixer', {
    options : [ 'last 1 version' ],
    dist : {
      files : [ {
        expand : true,
        cwd : '.tmp/concat/styles/',
        src : 'main.css',
        dest : '.tmp/concat/styles/'
      } ]
    }
  });
  grunt.config('cdnify', {
    dist : {
      html : [ 'dist/*.html' ]
    }
  });
  grunt.config('less', {
    development : {
      options : {
        paths : [ 'app/styles/less' ]
      },
      files : {
        'app/styles/main.css' : 'app/styles/less/main.less'
      }
    }
  });
  grunt.config('compress', {
    main : {
      options : {
        mode : 'tgz',
        archive : function() {
          return 'frontend-' + version + '.tar.gz';
        }
      },
      expand : true,
      cwd : 'dist/',
      src : [ '**/*' ],
      dest : 'frontend-' + version + '/'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-google-cdn');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('build', [ 'jshint', 'clean', 'less', 'useminPrepare', 'concat', 'autoprefixer', 'copy', 'imagemin', 'htmlmin', 'uglify',
      'cssmin', 'rev', 'usemin', 'copy:special', 'cdnify', 'compress' ]);

};