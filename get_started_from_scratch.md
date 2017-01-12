### Get Started from Scratch
-----
From project directory run the following
* $ `sudo apt-get install npm`
* $ `sudo npm update -g npm` *optional
* $ `sudo npm install -g yo bower grunt-cli`
* $ `sudo npm install -g generator-angular`
* $ `npm init` *this will create `package.json` file
* add entries as input below
  ```
  {
    "name": "qldarch-frontend",
    "version": "0.0.0",
    "description": "frontend UI for qldarch",
    "main": " ",
    "scripts": {
      "test": "grunt test"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/uq-eresearch/qldarch-frontend.git"
    },
    "author": "other",
    "license": "MIT",
    "bugs": {
      "url": "https://github.com/uq-eresearch/qldarch-frontend/issues"
    },
    "homepage": "https://github.com/uq-eresearch/qldarch-frontend#readme"
  }
  ```
* $ `npm install grunt grunt-autoprefixer grunt-wiredep grunt-concurrent grunt-contrib-clean grunt-contrib-coffee grunt-contrib-compass grunt-contrib-concat grunt-contrib-connect grunt-contrib-copy grunt-contrib-cssmin grunt-contrib-htmlmin grunt-contrib-imagemin grunt-contrib-jshint grunt-contrib-less grunt-contrib-uglify grunt-contrib-watch grunt-ng-constant grunt-ng-annotate grunt-rev grunt-rsync grunt-svgmin grunt-usemin jshint-stylish load-grunt-tasks requirejs time-grunt http-proxy-middleware grunt-google-cdn grunt-contrib-compress --save-dev`
* $ `npm install grunt-ng-constant --save`
* create (with copying the content of) these files
  ```
  Gruntfile.js
  /tasks/build.js
  /tasks/jshint.js
  /tasks/server.js
  ```
* create a file named `.bowerrc` in project folder, with following content
  ```
  {
    "directory": "app/bower_components"
  }
  ```
* create (with copying the content of) `bower.json` file
* $ `mkdir app`
* $ `mkdir app/bower_components`
* $ `bower install`