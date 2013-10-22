module.exports = ->
  @initConfig
    browserify:
      'dist/js/bundle.js': ['src/public/js/index.js']
      voxel:
        src: ['src/public/js/voxel/*']
        dest: 'dist/js/voxel/'
        expand: true
        flatten: true

    compass:
      css:
        options:
          sassDir: 'src/public/scss'
          cssDir: 'dist/css'
          environment: 'production'

    docs: require('./docpad')()

    connect:
      server:
        options:
          base: 'dist/'

    clean: ['dist/']

    watch:
      livereload:
        options:
          livereload: true

        files: ['dist/**/*']
        tasks: ['beep']

      docs:
        files: ['src/**/*', 'docpad.coffee', '!src/public/scss/*', '!src/public/js/**/*']
        tasks: ['docs']

      js:
        files: ['src/public/js/*.js', 'Gruntfile.coffee']
        tasks: ['browserify:dist/js/bundle.js', 'docs']

      css:
        files: ['src/public/scss/*.scss']
        tasks: ['compass']

      voxel:
        files: ['src/public/js/voxel/*.js']
        tasks: ['browserify:voxel']

  @loadNpmTasks(task) for task in require('matchdep').filterDev('grunt-*')

  @registerTask 'default', ['clean', 'compass', 'browserify', 'docs']
  @registerTask 'dev', ['default', 'connect', 'watch']
