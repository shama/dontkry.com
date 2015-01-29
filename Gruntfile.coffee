module.exports = ->

  @option('stack', true)

  @initConfig
    browserify:
      'dist/js/bundle.js': ['src/public/js/index.js']
      voxel:
        src: ['src/public/js/voxel/*']
        dest: 'dist/js/voxel/'
        expand: true
        flatten: true

    stylus:
      css:
        src: ['src/public/css/index.styl', 'src/public/css/monokai.css']
        dest: 'dist/css/index.css'

    docs: require('./docpad')()

    connect:
      server:
        options:
          base: 'dist/'

    clean: ['dist/']

    watch:
      docs:
        files: ['src/**/*', 'docpad.coffee', '!src/public/css/*', '!src/public/js/**/*']
        tasks: ['docs']
      js:
        files: ['src/public/js/*.js', 'Gruntfile.coffee']
        tasks: ['browserify:dist/js/bundle.js', 'docs']
      css:
        files: ['src/public/css/*.styl']
        tasks: ['stylus']
      voxel:
        files: ['src/public/js/voxel/*.js']
        tasks: ['browserify:voxel']

  @loadNpmTasks(task) for task in require('matchdep').filterDev('grunt-*')

  @registerTask 'default', ['clean', 'stylus', 'browserify', 'docs']
  @registerTask 'dev', ['default', 'connect', 'watch']
