module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    browserify: {
      'dist/js/bundle.js': ['src/public/js/index.js'],
      voxel: {
        src: ['src/public/js/voxel/*'],
        dest: 'dist/js/voxel/',
        expand: true,
        flatten: true,
      },
    },
    compass: {
      css: {
        options: {
          sassDir: 'src/public/scss',
          cssDir: 'dist/css',
          environment: 'production',
        },
      },
    },
    docs: require('./docpad.js')(),
    connect: {
      server: {
        options: { base: 'dist/' },
      },
    },
    clean: ['dist/'],
    spell: {
      docs: ['src/documents/posts/**/*'],
    },
    watch: {
      docs: {
        files: ['src/**/*', 'docpad.js', '!src/public/scss/*', '!src/public/js/**/*'],
        tasks: ['docs'],
      },
      js: {
        files: ['src/public/js/*.js'],
        tasks: ['browserify:dist/js/bundle.js', 'docs'],
      },
      css: {
        files: ['src/public/scss/*.scss'],
        tasks: ['compass'],
      },
      voxel: {
        files: ['src/public/js/voxel/*.js'],
        tasks: ['browserify:voxel'],
      },
    },
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['clean', 'compass', 'browserify', 'docs']);
  grunt.registerTask('dev', ['default', 'connect', 'watch']);

  // my own browserify task :'|
  grunt.registerMultiTask('browserify', function() {
    grunt.util.async.forEachSeries(this.files, function(file, next) {
      var files = grunt.file.expand({filter: 'isFile'}, file.src).map(function(f) {
        return require('path').resolve(f);
      });
      var b = require('browserify')(files).bundle();
      var dir = require('path').dirname(file.dest);
      if (!grunt.file.exists(dir)) grunt.file.mkdir(dir);
      b.pipe(require('fs').createWriteStream(file.dest));
      b.on('end', function() {
        grunt.log.ok('Bundled ' + file.dest);
        next();
      });
    }, this.async());
  });
};
