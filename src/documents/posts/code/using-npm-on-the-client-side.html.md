---
layout: post
title: "Using npm on the client side"
description: "It is not just for the server side!"
date: 2013-05-28
project: npm
---
## Package Manager Anonymous
I didn't always use npm for front end package management. I tried a few, got stoked with one and converted all my co-workers to it. It was a great client side package manager. Why? Because it was so much like npm! Until one day a bearded friend said, "You know what else is like npm?", *dramatic pause*, "... npm." Mind blown.

Seriously why can't we use npm for front end? There isn't a rule. It is the *node* package manager but the word *node* doesn't explicitly mean server only.

**Don't let anyone tell you npm is not for the client side.**

It is and works fantastically well for the front end.

## Easy To Install
npm comes with Node.js. So just install Node.js by visiting [nodejs.org](http://nodejs.org).

This gives you the command `npm` in your terminal.

## Love at First Publish

Create a `package.json` file. This describes your package. Or use `npm init` to ask a series of questions and npm will create a `package.json` for you.

``` json
{
  "name": "mymodule",
  "version": "0.1.0"
}
```

Once you have your `package.json` filled out, simply type: `npm publish`. This will create a new package on [npmjs.org](http://npmjs.org) based on the `name` property in your `package.json` file. Your package will now be installable by anyone who types `npm install yourpackagename`.

## Installing Packages

`npm install package` to install a package found on [npmjs.org](http://npmjs.org). This will download the files to your `node_modules` folder.

`npm install package --save` will install and save the package as a dependency in your `package.json` file. Why is this cool? Well later down the road you can install all your dependencies by simply typing the command `npm install`.

`npm install username/repo` will install directly from a github repo.

## Using on the Browser
In order to use node modules on the browser you will need a build tool. This might bother you. If this is a deal breaker then by all means continue wasting your life copying and pasting code and arranging your script tags.

**All package managers need build tools.** Some say they don't but they are not being totally honest. It doesn't matter if you build by typing a command in your terminal or build upon a HTTP request or build inline as the page loads. Those are build tools.

*When* you build does not negate *that* you build, sorry. So embrace a build tool.

## Building From the Console
Let's keep it simple. [browserify](http://browserify.org/) is a simple tool for bundling node modules for the browser.

Install it with `npm install browserify -g`. The `-g` will install the package globally and give you access to the `browserify` command.

Create an `index.js` entry point with the following:

``` javascript
// Use a Node.js core library
var url = require('url');

// Parse the URL of the current location
var parts = url.parse(window.location);

// Log the parts object to our browser's console
console.log(parts);
```

To bundle this to run on the browser type the command: `browserify index.js > bundle.js`. This will create the file `bundle.js` so that your browser can run it with the tag: `<script src="bundle.js"></script>`.

## A Simple Module
Small modules are the reason why npm is so successful. They are easy to create, maintain and share. Create another file named `hasher.js` with the following:

``` javascript
// Use a Node.js core library
var url = require('url');

// What our module will return when require'd
module.exports = function(url) {
  var parsed = url.parse(url);
  return parsed.hash;
};
```

Now modify your `index.js` file to the following:

``` javascript
var hasher = require('./hasher.js');
var hash = hasher(window.location);
console.log(hash);
```

Moving logic into separate modules will help keep our app small and easy to maintain. Plus we've just started on the greatest url hash parsing library ever!

## On the Shoulders of Everyone
What? You don't want to write the worlds best url hash parsing library? Well good news someone else probably already did. Search [npmjs.org](http://npmjs.org) and I guarantee you'll find oodles. At the time of this writing npm has **over 30,000 modules**. Most of which are browserifyable.

This is the advantage of creating and using lots of small modules. One module may not be a good fit for your project. It is trivial to swap out a small module for another.

A quick `npm search hash change` revealed a few options. Lets go with `hash-change`. After a quick peruse of the [hash-change read me](https://npmjs.org/package/hash-change) we know how to use it. So let's edit our `index.js`:

``` javascript
require('hash-change').on('change', function(hash) {
  console.log('Goto page: ' + hash);
});
```

Cool now I can get the hash and even know when it is changed. The best part is now I don't have to maintain the `hash-change` code. Someone else now does that for me for free.

## Building Upon a HTTP Request
An alternative is to build as you request from the server. If you have `<script src="index.js"></script>` on your page, the browser will request the `index.js` file from the server. You simply instruct your server to first compile that file and then give the results to the browser.

A handy tool for javascript is called [beefy](http://didact.us/beefy/): `npm install beefy -g`. It is a browserify wrapper for this exact purpose.

Type `beefy index.js 8080` to start a server on port `8080`. Then send your browser to `http://localhost:8080` and as your browser requests `index.js` it will compile with browserify and serve the results.

## Stylesheets
The lazy way is to load assets directly from the `node_modules` folder:

```html
<link type="text/css" rel="stylesheet" href="node_modules/package/css/style.css">
```

A method more similar to browserify is [npm-css](https://npmjs.org/package/npm-css). Install with `npm install npm-css -g` and bundle with `npm-css index.css > bundle.css`:

``` css
/* Use CSS from your node_modules folder */
@import "npm_module_name";

/* Or your own relative files */
@import "./style.css";
```

I don't enjoy writing CSS so I use a preprocessor. My preference is [sass/compass](http://compass-style.org) but that requires Ruby (which is a dependency hurdle most are comfortable jumping). There are many other CSS preprocessors available on npm though. Check out [rework](https://npmjs.org/package/rework) or [stylus](https://npmjs.org/package/stylus).

Install rework with `npm install rework -g`. Then create the following file `style.css`:

``` css
body {
  background: linear-gradient(#eee, #ddd);
}
```

We then bundle our css with `rework -v webkit,moz < style.css > bundle.css` and it creates the file:

``` css
body {
  background: -webkit-linear-gradient(#eee, #ddd);
  background: -moz-linear-gradient(#eee, #ddd);
  background: linear-gradient(#eee, #ddd)
}
```

It does a lot more than that though so checkout [rework's readme](https://npmjs.org/package/rework).

## Images
Images are fairly straight forward:

``` shell
cp -R node_modules/module/images/* dist/images/.
```

Or just be lazy and load directly from the `node_modules` folder.

There are many modules on npm for creating spritesheets, sizing, applying filters, etc. If you wanted to get fancy.

## HTML
The one thing npm might have too much of is template choices. You can keep it simple and just write plain HTML or choose from one of the hundreds of template options. My preference is plain HTML, [embedded javascript](https://npmjs.org/package/ejs) for layouts and [markdown](https://npmjs.org/package/marked) for articles/posts.

## Tying it All Together
How are these tools are tied together is heavily debated. So I'll just describe the two ways I prefer but feel free to search out and use what works for you.

### Simple Shell Script
Shell scripts for small modules are easy to write. Just put the commands you would have normally typed into a file. Create a file named `bin/build` with the following:

``` shell
#!/bin/bash
rm -rf dist
mkdir -p dist/js
mkdir -p dist/css
mkdir -p dist/img
browserify js/index.js > dist/js/index.js
rework -v webkit,moz < css/style.css > dist/css/style.css
cp -R img/* dist/img/.
cp index.html dist/index.html
```

`chmod +x bin/build` to give the script execute permissions and then run it by typing `bin/build`.

### Grunt
If you need build operations a bit more front end friendly consider [Grunt](http://gruntjs.com). Grunt ties build operations together through a `Gruntfile.js`. Each of the tasks source input files and destination output files are normalized through a Grunt config. An example `Gruntfile.js` for the same operations as above would be:

``` javascript
module.exports = funciton(grunt) {
  grunt.initConfig({
    clean: ['dist/'],
    browserify: {
      'dist/js/index.js': ['js/index.js']
    },
    rework: {
      'dist/css/style.css': ['css/style.css'],
      options: {
        vendors: ['-moz-', '-webkit-']
      }
    },
    copy: {
      images: {
        src: 'img/**',
        dest: 'dist/',
        expand: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rework');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean', 'browserify', 'rework', 'copy']);
};
```

First install the grunt cli tool globally with: `npm install grunt-cli -g`.

Then install grunt and the tasks we would like to use locally:

``` shell
npm install grunt grunt-contrib-clean \
grunt-contrib-copy grunt-rework grunt-browserify --save-dev
```

Now when you run `grunt` anywhere within the project folder it will perform the steps in the default task you've registered.

The advantages of Grunt really show when you're experimenting with new modules. Most Grunt tasks use the same config syntax. So you can more easily configure your build process without having to remember each module API.

## Conclusion
All package managers do relatively the same thing. Move files.  
Pick a package manager on how well it does that.

All build tools do relatively the same thing. Transform files.  
Pick your build tools on how well they do that.

**If you're not using npm now solely because someone told you it isn't for client side.**

**Slap them and say, "npm all the things."**
