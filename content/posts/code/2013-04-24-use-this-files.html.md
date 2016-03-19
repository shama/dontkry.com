---
layout: post
title: "Use this.files Not this.data"
description: "If your Grunt task handles files you should be using this.files and not this.data"
date: 2013-04-24
project: gruntjs
icon: fire
---
The following contains **only some of the ways** users will target their files in a `Gruntfile.js`. The main job Grunt will do for you is take a bunch of configurations and give you a normalized simple array known as `this.files`. Here is an example that will concatenate files:

``` javascript
// our Grunt config
grunt.initConfig({
  example: {
    target: {
      src: ['lib/*.js'],
      dest: 'compiled.js',
    },
  },
});

// our example task
grunt.registerMultiTask('example', function() {
  this.files.forEach(function(file) {
    var output = files.src.map(function(filepath) {
      return grunt.file.read(filepath);
    }).join('\n');
    grunt.file.write(file.dest, output);
  });
});
```

Now you may be tempted by a little API called `this.data`. Here is a task that does the same thing but uses this evil API:

``` javascript
// dont do this
grunt.registerMultiTask('example', function() {
  var output = grunt.file.expand(this.data.src).map(function(filepath) {
    return grunt.file.read(filepath);
  }).join('\n');
  grunt.file.write(this.data.dest, output);
});
```

The above example is bad because it **only** handles a single configuration: `src` and `dest` within a target.

<br/>
This next configuration is perfectly valid in Grunt and users *will do this* even if you don't:

``` javascript
grunt.initConfig({
  example: {
    'compiled.js': ['lib/*.js'],
  },
});
```

Nice and short. If your task uses `this.files` you don't have to change a thing. It just works.

What about you unfortunates that use `this.data`? Sorry, you will have to rewrite your task. But now you have to check whether the `target` is the `dest` and `this.data` is now the `src`. Have fun with that.

<br/>
Here is another valid Grunt config:

``` javascript
grunt.initConfig({
  example: {
    people: {
      files: {
        'girls': ['lib/girl_*'],
        'boys': ['lib/boy_*'],
      },
    },
  },
});
```

Now the user can run `grunt example:people` to only concat people. Using `this.files`? Cool it works. Using `this.data`? Nope.

<br/>
Let's change the example. What if my task compiled files such as minifying, templates or, I don't know, browserifying?

Eventually you'll need to compile to more than one `dest`. You could add a `'dest': ['src/*']` line for each one but around 10 or so it gets pretty ridiculous. Some cases you won't know the `dest` file.

This valid Grunt config will `uglify` each file within the `things/` folder and put each minified file into the `putaway/` folder:

``` javascript
grunt.initConfig({
  uglify: {
    things: {
      src: ['things/*'],
      dest: 'putaway/',
      expand: true,
    },
  },
});
```

`this.files`... Yep.

`this.data`... Nope.

<br/>
Now what if I want to configure my `Gruntfile.js` to only compile files that have been modified in the last 24 hours? Try the most underused part of the Grunt API, `filter`:

``` javascript
grunt.initConfig({
  concat: {
    logs: {
      src: ['logs/**/*'],
      dest: "daily-<%= grunt.template.today('yyyy-mm-dd') %>.log",
      filter: function(filepath) {
        var mtime = new Date(require('fs').lstatSync(filepath).mtime).getTime();
        var dayago = new Date().getTime() - (24 * 60 * 60 * 1000);
        return (mtime >= dayago);
      },
    },
  },
});
```

Now you have daily logs concatenated. Oh yeah see how I used a template (`<%= ... %>`) within the `dest`? Make sure you process those templates `this.data` consumers... or just use `this.files` instead.

<br/>
We are just skimming the surface though. Here are some of the other file matching options availble: `nonull`, `dot`, `flatten`, `matchBase`, `cwd`, `ext`, `rename` as well as all the [node-glob](https://github.com/isaacs/node-glob) and [minimatch](https://github.com/isaacs/minimatch) options. [View the Grunt docs](http://gruntjs.com/configuring-tasks#files) for more information on file matching.

The only acceptable use of `this.data` in my opinion is if your task doesn't handle files. Those tasks are usually rare.

## Conclusion
It doesn't matter if you won't use these features. **Other Grunt users will.** Grunt was made to manage files. So if you're not utilizing `this.files` for managing files then why are you using Grunt?
