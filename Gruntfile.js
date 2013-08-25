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
        options: {
          base: 'dist/'
        },
      },
    },
    clean: ['dist/'],
    spell: {
      docs: ['src/documents/posts/**/*'],
    },
    watch: {
      livereload: {
        options: { livereload: true },
        files: ['dist/**/*'],
        tasks: ['beep'],
      },
      docs: {
        files: ['src/**/*', 'docpad.js', '!src/public/scss/*', '!src/public/js/**/*'],
        tasks: ['docs'],
      },
      js: {
        files: ['src/public/js/*.js', 'Gruntfile.js'],
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
};
