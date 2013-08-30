---
layout: post
title: "AngularJS, Browserify and Grunt"
description: ""
date: 2013-08-30
---
Let's setup a new project that uses [AngularJS](http://angularjs.org), [Browserify](http://browserify.org) and [Grunt](http://gruntjs.com).

> This tutorial assumes you have Node.js installed and are familiar with it and Grunt.  
> If not please read [using npm on the client side](/posts/code/using-npm-on-the-client-side.html).

## Create a Project
Create a folder to contain the project and init your `package.json` file within it:

```
mkdir mysite && cd mysite
npm init
```

Start by installing the development dependencies you'll need to run Grunt and Browserify through Grunt:

```
npm i grunt grunt-browserify grunt-contrib-copy --save-dev
```

At the time of this writing, AngularJS does not have an official package on npm and that is too bad. But! That isn't going to stop us. You can easily install arbitrary packages not setup for npm using [napa](http://npmjs.org/package/napa):

```
npm i napa --save-dev
```

Then in your `package.json` add the following install script:

``` json
{
  "scripts": {
    "install": "napa angular/bower-angular:angular"
  }
}
```

Now any time you run `npm install` it will also install AngularJS into the `node_modules/angular/` folder from their official release.

### Folder Structure
Let's setup a folder structure based upon the [angular-seed](https://github.com/angular/angular-seed) example. Create the files and folders to make your app look like the following (don't worry about what's in them right now):

```
|- app/
|--- css/
|----- app.css
|--- js/
|----- app.js
|--- partials/
|----- partial1.html
|----- partial2.html
|--- index.html
|- Gruntfile.js
|- package.json
```

### Gruntfile
Next let's setup your `Gruntfile.js` to build your site upon typing the `grunt` command within the project folder:

``` javascript
module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      js: {
        // A single entry point for our app
        src: 'app/js/app.js',
        // Compile to a single file to add a script tag for in your HTML
        dest: 'dist/js/app.js',
      },
    },
    copy: {
      all: {
        // This copies all the html and css into the dist/ folder
        expand: true,
        cwd: 'app/',
        src: ['**/*.html', '**/*.css'],
        dest: 'dist/',
      },
    },
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['browserify', 'copy']);
};
```

## Building Your App
Now you're all ready to begin building your app. Let's start with the `app/index.html`:

### HTML

``` html
<!doctype html>
<!-- Specify the AngularJS app to use -->
<html lang="en" ng-app="myApp">
<head>
  <meta charset="utf-8">
  <title>My AngularJS App</title>
  <!-- The css is copied into dist/css/app.css by the copy task -->
  <link rel="stylesheet" href="css/app.css"/>
</head>
<body>

  <ul class="menu">
    <li><a href="#/view1">view1</a></li>
    <li><a href="#/view2">view2</a></li>
  </ul>

  <!-- A simple AngularJS view -->
  <div ng-view></div>

  <!-- This script will be bundled by the browserify task into dist/js/app.js -->
  <!-- You should only ever really need this one script tag -->
  <script src="js/app.js"></script>
</body>
</html>
```

### JavaScript
Getting Angular to play nice with Browserify is incredibly simple. In your `app/js/app.js` file add the following:

``` javascript
// This will include ./node_modules/angular/angular.js
// and give us access to the `angular` global object.
require('angular/angular');

// Create your app
angular.module('myApp', []).config(['$routeProvider', function($routeProvider) {
  // Specify routes to load our partials upon the given URLs
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
```

That is it! Now when you click on or navigate to `#/view1` and `#/view2` it will load the contents of your `app/partials/partial1.html` into your `ng-view`.

## Continuing with AngularJS
Let's create a simple value service, filter and use it in one of your partials.

First create a `app/js/services.js` file with the following contents:

``` javascript
angular.module('myApp.services', []).
  value('version', '0.1');
```

Next create a `app/js/filters.js` file with the following contents:

``` javascript
angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
```

Now you can include these in your bundle by requiring them in your `app/js/app.js` file:

``` javascript
require('angular/angular');

// Relative paths to include services.js and filters.js into your bundle
require('./services');
require('./filters');

// then include them into your app
angular.module('myApp', ['myApp.filters', 'myApp.services'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html'});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
```

Now you can use the filter in your HTML. Edit your `app/partials/partial1.html` file with the following:

``` html
<p>This is the partial for view 2.</p>
<p>
  Showing of 'interpolate' filter:
  {{ 'Current version is v%VERSION%.' | interpolate }}
</p>
```

## Globals
Binding a global function to a controller isn't a good idea, IMO, as you're cluttering the global namespace but is possible using Browserify. Simply make sure to add it to the `window` global object. Create a `app/js/HelloController.js` file with the following:

``` javascript
window.HelloController = function($scope) {
  $scope.dude = 'AngularJS';
};
```

In your `app/index.html` use the controller:

``` html
<div ng-controller="HelloController">
  Hi {{dude}}!
</div>
```

and finally bundle your controller by adding it to your `app/js/app.js` file:

``` javascript
require('./HelloController');
```

## Conclusion
These are fairly basic examples of using AngularJS with Grunt and Browserify. They can easily be extended to use `grunt-contrib-connect` and `grunt-contrib-watch` to build your app upon file changes and serve the `dist/` folder on a local server. As well as all the other Grunt tasks available, eg.: testing, templates pre-processing, etc.

The goal here is to keep it as simple as possible with AngularJS while still automating the build process.
