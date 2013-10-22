---
layout: post
title: "Grunt Tricks: Part One"
description: "Common Grunt problems and their solutions"
project: gruntjs
date: 2013-10-17
---
Here are a few solutions to common problems you may encounter while using Grunt.

## Configuring Tasks Dynamically
A good Gruntfile is declarative but sometimes explicitly declaring your config can be cumbersome or impossible.

For example we have some tests:

```
| - tests/
| --- apple_test.js
| --- peach_test.js
| --- tomato_test.js
```

I could configure my Gruntfile to run all these tests with:

``` javascript
grunt.initConfig({
  nodeunit: {
    tests: ['tests/*_test.js'],
  },
});
```

Now I would like to run an individual test, I could simply modify my src to `['tests/apple_test.js']` but that is lame. I could create a target for each test:

``` javascript
grunt.initConfig({
  nodeunit: {
    // This is lame
    apple: ['tests/apple_test.js'],
    peach: ['tests/peach_test.js'],
    tomato: ['tests/tomato_test.js'],
  },
});
```

Now I can run `grunt nodeunit:apple` to run individual tests but this way is also lame.  
Lame, lame, lame.

Let's use a dynamic alias task instead:

``` javascript
grunt.initConfig({
  nodeunit: {
    all: ['tests/*_test.js'],
  },
});
grunt.registerTask('test', function(file) {
  if (file) grunt.config('nodeunit.all', 'tests/' + file + '_test.js');
  grunt.task.run('nodeunit');
});
```

Now by default if we run `grunt test` it will run all our tests. We can now run individual tests with `grunt test:apple` or `grunt test:peach`.

Let's extend this task and make it run any number of test groups:

``` javascript
grunt.initConfig({
  nodeunit: {
    all: ['tests/*_test.js'],
  },
});
grunt.registerTask('test', function() {
  var tests = Array.prototype.slice.call(arguments, 0).map(function(test) {
    return 'tests/' + test + '_test.js';
  });
  if (tests.length > 0) grunt.config('nodeunit.all', tests);
  grunt.task.run('nodeunit');
});
```

Now we can do `grunt test:apple:tomato` to only run the apple and tomato tests.

Pretty neat. Just be sure to use when necessary. Make sure your config stands on it's own without the alias task and avoid implementing too much logic when dynamically setting your config. Gruntfiles should be declarative and people should be able to quickly understand how your Gruntfile is configured without tracing through too many function calls.


## Customize File Input: filter
Grunt accommodates a wide variety of ways to match files through [glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch).

But sometimes you need to further select files or programmatically filter files. This is where the `filter` property of Grunt becomes useful.

Say we have the following file tree:

```
| - lib/
| --- tacos.js
| --- burritos.js
| --- tamales.js
```

When making our delicious Mexican food app we hope that Douglas Crockford will use it. So let's make sure we don't forget any semicolons and lint our code with the more friendly derivative of Crockford's library, [JSHint](http://jshint.com/).

Our Gruntfile is configured as such to lint our files:

``` javascript
grunt.initConfig({
  jshint: {
    all: ['lib/*.js'],
  },
});
```

Now each time we run `grunt jshint` it will lint all of our js files within `lib/`. As the items on our menu increases, linting all of the files every time may get slower and slower.

We are really only interested in linting the files we've edited in the last day. Say hello to the `filter` property. It accepts a string of a known [fs.Stats method name](http://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats) or more useful a anonymous function that returns `true` or `false` whether to feed the file to the task:

``` javascript
grunt.initConfig({
  jshint: {
    all: {
      src: ['lib/*.js'],
      filter: function(filepath) {
        // When the file was modified
        var filemod = (require('fs').statSync(filepath)).mtime;

        // One day ago
        var dayago = (new Date()).setDate((new Date()).getDate()-1);

        // If the file was modified in the last day, give to the task
        // otherwise filter it out
        return (filemod > dayago);
      },
    },
  },
});
```

*You can get more advanced with this by saving the time you last ran your task and comparing to that date. That way you'll only get the files you've recently edited rather than in the last day. There are [other](https://github.com/gruntjs/grunt-contrib-watch#compiling-files-as-needed) [methods](https://github.com/tschaub/grunt-newer) to handle this as well.*

*I prefer the above approach as when you're working on a team that is simultaneously running a Gruntfile. Having the last modified interval set statically will work the same with multiple people editing at the same time (albeit sometimes a little slower as it might match files you're not entirely interested in).*

**Always remember Gruntfiles are javascript!** Utilize these functional helpers often and try to name them more semantically for re-usability across your tasks:

``` javascript
function lastModified(minutes) {
  return function(filepath) {
    var filemod = (require('fs').statSync(filepath)).mtime;
    var timeago = (new Date()).setDate((new Date()).getMinutes() - minutes);
    return (filemod > timeago);
  }
}
grunt.initConfig({
  jshint: {
    all: {
      src: ['lib/*.js'],
      filter: lastModified(24 * 60) // one day ago
    },
  },
});
```


## Customize File Output: rename

Where the `filter` property is useful for modifying the file input, `rename` is useful for modifying the file output or the destination of the your files.

Let's say you have a bunch of components you wish to copy. Your file tree looks like such:

```
| - components/
| --- penne/
| ----- js/
| ------- index.js
| --- gnocchi/
| ----- js/
| ------- index.js
| --- malfatti/
| ----- js/
| ------- main.js
| - dist/
| --- js/
```

and you would like to copy each of the different component javascript files individually to your `dist/js/` folder for packaging:

``` javascript
grunt.initConfig({
  copy: {
    components: {
      expand: true,
      flatten: true,
      cwd: 'components',
      src: ['*/js/*.js'],
      dest: 'dist/js',
    },
  },
});
```

Which will copy every javascript file within each `js/` folder of each component into the `dist/js/` folder.

We have a problem though. Some of the file names conflict and will overwrite each other.

`rename` to the rescue!

``` javascript
grunt.initConfig({
  copy: {
    components: {
      expand: true,
      //flatten: true, // dont need this now as we'll flatten using rename
      cwd: 'components',
      src: ['*/js/*.js'],
      dest: 'dist/js',
      rename: function(dest, src) {
        var path = require('path');

        // Get the name of the component folder (or first folder in src path)
        var component = src.split(path.sep).slice(0, 1)[0];

        // Prefix each javascript file with the
        // component folder name into the destination
        return path.join(dest, component + '_' + path.basename(src));
      },
    },
  },
});
```

With this our `dist/js/` folder will look like:

```
| - dist/
| --- js/
| ----- penne_index.js
| ----- gnocchi_index.js
| ----- malfatti_main.js
```

## Conclusion

The "Building the files object dynamically" section of the "Configuring Tasks" page in the Grunt docs is by far the most useful section of the docs. I highly encourage reading it and keeping it bookmarked as reference: [http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically).

Stay tuned for more Grunt tricks!
