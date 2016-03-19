---
layout: post
title: "Grunt Tricks: Part Two"
description: "Common Grunt problems and their solutions"
project: gruntjs
date: 2014-06-21
---

## Dynamic Alias Tasks

Commonly with Grunt, you'll have a block of config along with a block of task definitions:

``` javascript
// Config block
grunt.initConfig({
  clean: {
    dist: 'dist/',
  },
  builder: {
    app: { src: ['src/**/*.js'], dest: 'dist/app.js' },
    test: { src: ['test/**/*.js'], dest: 'dist/test.js' },
  },
});

// Tasks block
grunt.registerTask('build', ['clean', 'builder']);
grunt.loadNpmTasks('grunt-imaginary-builder');
```

Now any time you run `grunt build` it will clean the `dist/` folder and run our imaginary `builder` task to compile your `src/` and `test/` files.

This is fine until your src and test become large and slow down your build. If we want to selectively build either `src` or `test`, we could use targets and additional tasks but that clutters up the Gruntfile. Let's turn `build` into a dynamic alias task:

``` javascript
grunt.registerTask('build', function(which) {
  var task = 'builder';
  if (which) task += ':' + which;
  grunt.task.run(['clean', task]);
});
```

`grunt build` will operate as before but now you have the option to `grunt build:app` will only run builder on our `src/` files.

Arguments are passed to Grunt tasks separated by a colon, i.e.: `grunt task:arg1:arg2`.

Utilizing a function rather than an array for defining your task runs can help give you more programmatic control over your task flow.

## Asynchronous Flow

Grunt is synchronous by design to make it easier for new users to approach. Each task will only run after the last task has finished, in a series. The Gruntfile loads synchronously and all of the APIs within Grunt run synchronously.

This is great for a new user becoming acclimated with JavaScript and works for most use cases. Although and quite often with JavaScript, you need to deal with asynchronous operations.

### Async Dynamic Alias Task

Extending the dynamic alias task, what if we wanted to programmatically control the flow of our tasks but required an asynchronous operation to do so? Such as including the SHA of our git controlled project in the destination file name. We can update our `build` task as such:

``` javascript
grunt.registerTask('build', function(which) {
  // Instruct this task to wait until we call the done() method to continue
  var done = this.async();

  // Run `git rev-parse HEAD` to get the SHA
  grunt.util.spawn({
    cmd: 'git',
    args: ['rev-parse', 'HEAD']
  }, function(err, sha, stderr) {
    // TODO: Handle error

    // Alter the config to include the SHA in the destination file names
    grunt.config('builder.app.dest', 'dist/app.' + sha + '.js');
    grunt.config('builder.test.dest', 'dist/test.' + sha + '.js');

    // Schedule tasks to run immediately after this one
    var task = 'builder';
    if (which) task += ':' + which;
    grunt.task.run(['clean', task]);

    // All done, continue to the next tasks
    done();
  });
});
```

> Read more about [grunt.util.spawn](http://gruntjs.com/api/grunt.util#grunt.util.spawn)

Now running `grunt build` will shell out and call `git rev-parse HEAD` to get the latest SHA then dynamically set the config for each destination file name to include it. Our imaginary `builder` task will compile files with destinations like such: `dist/app.f56d40ee0f06f8c9b7ea53a7daec6a4d478356f9.js`.

With this you can programmatically set your config and schedule the desired task flow.

## Task All The Things

Nearly every question that begins with, *"With Grunt, how do I..."* The answer is: **create a task.**

I recommend creating tasks liberally. They truly are the best way to solve things with Grunt.

In doing so, you may find your Gruntfile growing long. This is where [grunt.loadTasks](http://gruntjs.com/api/grunt.task#grunt.task.loadtasks) becomes useful.

Create a folder named `tasks/` and then add the line: `grunt.loadTasks('tasks');` to your Gruntfile. Now any file put in the `tasks/` folder will be loaded by Grunt.

Add a task by creating a file named `tasks/build.js` with the content of your task wrapped in a function:

``` javascript
// tasks/build.js
module.exports = function(grunt) {
  grunt.registerTask('build', function(which) {
    /* Contents of the task... */
  });
};
```

You can even move the portions of your config related to this task into this file by using `grunt.config`:

``` javascript
// tasks/build.js
module.exports = function(grunt) {

  // Sets only the "builder" section of your config
  grunt.config('builder', {
    app: { src: ['src/**/*.js'], dest: 'dist/app.js' },
    test: { src: ['test/**/*.js'], dest: 'dist/test.js' },
  });

  // Create a wrapper task to customize the task flow
  grunt.registerTask('build', function(which) {
    /* Contents of the task... */
    grunt.task.run(['builder']);
  });

  // Even load npm-installed plugins from here
  grunt.loadNpmTasks('grunt-imaginary-builder');
};
```

This keeps your main Gruntfile simple:

``` javascript
// Gruntfile.js
module.exports = function(grunt) {
  // Your initial config block
  grunt.initConfig({
    clean: {
      dist: 'dist/',
    },
  });
  // Load your app specific tasks
  grunt.loadTasks('tasks');
  // Load npm installed tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Your entry point task flows
  grunt.registerTask('default', ['build']);
};
```

## Conclusion

Grunt defaults to declarative and config based but allows you to move as far as you want towards a imperative and programmatic build system.
