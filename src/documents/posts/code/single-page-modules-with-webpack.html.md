---
layout: post
title: "Single Page Modules with Webpack"
description: "Bundling modules for ambitious single page applications"
date: 2013-11-28
---
Not so recently, I came across an ambitious module bundler that only until recently did I realize how fantastic it is for bundling single page apps.

A couple of years ago an amazing JavaScript developer named Tobias Koppers aka [@sokra](https://github.com/sokra) began bombarding me with pull requests on [jmpress.js](https://github.com/jmpressjs/jmpress.js). A very short time later I gave him commit access and he took jmpress.js to an entirely new level.

More interestingly, a tad bit later sokra created a project called [webpack](https://github.com/webpack/webpack). At the time, I didn't pay it much mind as I was primarily building SEO friendly websites and not really apps.

Venturing deeper into JavaScript, my sites became more and more like web apps with API back ends until now, where single page apps are all I build.

Other module bundlers have their pros and cons depending on each project and I've always used them accordingly. Webpack, now nearing 1.0.0 stable, is very ideal for building large single page apps.

## First Glance
Webpack, by default, adopts many of the Node.js conventions and behaves similar to [Browserify](http://browserify.org/).

`require('./lib/local.js')` and `require('../other.js')` work intuitively. The file is resolved relative to where the require statement was called.

It also will load modules from a `node_modules/` folder if `./` is not prefixed, for example: `require('npm-package')`.

As well as loading files from within vendor packages: `require('npm-package/lib/thing.js')`.

## Asynchronous Loading
Bundling your entire app into a single file for large apps doesn't really work. At least if you care about start up time, mobile devices or saving bytes for conditional parts of your app. Determining how your app is chunked shouldn't be an after thought as well. Webpack handles chunking very elegantly.

At any time, you can have a portion of your app load asynchronously by using an AMD-like syntax:

``` javascript
require([], function() {
  // The `d3` module will go into another file
  // and loaded with another request when needed
  var d3 = require('d3');
});
```

Great for conditionally loading large modules or assets in Ember:

``` javascript
module.exports = Ember.Route.extend({
  model: function(params) {
    return new Ember.RSVP.Promise(function(resolve) {
      // Asynchronously load this large data chunk module
      require([], function() {
        var data = require('./data/large.js');
        resolve(data);
      });
    });
  }
});
```

You can further optimize by merging smaller chunks or setting max chunks among other optimizations using the [optimize option](https://github.com/webpack/docs/wiki/webpack-options#optimize).

## Package Manager Agnostic
I love npm but let's face it, everybody doesn't publish their modules to npm nor publish correctly. Webpack seamlessly translates modules from any vendor folder. Bower is a popular package manager for front end modules and by default will load modules into the `bower_components/` folder.

Configuring webpack to first look into `node_modules/` and then into `bower_components/` is easy:

``` javascript
// webpack.config.js
module.exports = {
  entry: 'app/index.js',
  output: {
    path: 'dist/',
    filename: 'bundle.js',
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  },
};
```

Now when you `require('agnostic-module')` webpack will search both install locations and pick the first found package.

## Embracing Chaos
Like package managers, module authors cannot agree on a module format. Quite a few don't even modularize and expose globals. A common strategy is to expose and re-publish the package on npm. That is awful. Usually the module isn't exposed correctly and becomes out of date with the re-author falls behind on maintaining. (*I'm guilty of it too.*)

Webpack solves it through loaders.

Have a library that just has a **global**? Use the [exports-loader](https://npmjs.org/package/exports-loader):

``` javascript
// module.js
Bear = {
  say: function() {
    console.log('Rawr! Im a bear!');
  }
};
```

``` javascript
// app.js
var Bear = require('exports?Bear!./module.js');
```

What about large libraries you would normally just throw in a script tag and don't want to parse like **jQuery, Ember, Handlebars, etc**? Use the [script-loader](https://npmjs.org/package/script-loader) and it will act as if you added a script tag BUT! without extra the network request:

``` javascript
require('script!jquery/jquery.js');
$('body').append($('<div/>').html('Hooray!'));
```

Have a library that uses **CoffeeScript** and didn't include a compiled version? Use the [coffee-loader](http://npmjs.org/coffee-loader):

``` javascript
var hip = require('coffee!hipster/cool.coffee');
```

### Configuring Loaders
Most of the time loaders are more easily configured within your `webpack.config.js`:

``` javascript
module.exports = {
  entry: 'app/index.js',
  output: {
    path: 'dist/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee' },
    ],
  },
};
```

Now any file that ends with `.coffee` such as, `require('./lib/bear.coffee')` will be ran through the coffee loader.

## Everything is a Module
Probably most unique to webpack is **everything is a module**. CSS, images, fonts... all are modules.

Need to read a CSS file? Use the [css-loader](http://npmjs.org/css-loader) BUT! the best part is `@import` statements are treated like `require()` statements:

``` css
/* node_modules/bear/style.css */
.bear {
  color: brown;
}
```

``` css
/* app/css/style.css */
@import 'css!bear/style.css'
```

``` javascript
// app/index.js
var css = require('css!./css/style.css');
```

Most of the time you just want to apply this modularized CSS to the page. Use the [style-loader](http://npmjs.org/style-loader):

``` javascript
// This stylesheet will be applied to your page
require('style!css!./css/style.css');
```

Or more simply, just configure the loader in your `webpack.config.js`:

``` javascript
module.exports = {
  entry: 'app/index.js',
  output: {
    path: 'dist/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
    ],
  },
};
```

Now you can just `require('./css/style.css')` and it will apply the CSS to your page.

### Using Stylus (or any other CSS pre-processor)?

Use the [stylus-loader](http://npmjs.org/stylus-loader) instead in your chain:

``` javascript
module.exports = {
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.styl$/, loader: 'style!stylus' },
    ],
  },
};
```

Now you can require stylus files anywhere, the `@import` statements will be resolved and applied to your page.

### Images as Modules
Commonly you'll have images within your stylesheet that you'll want to inline as data-urls, images from a vendor package or just direct access to manipulate and dynamically embed an image.

Use the [url-loader](http://npmjs.org/url-loader) and [file-loader](http://npmjs.org/file-loader):

``` javascript
module.exports = {
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.png/, loader: 'url?limit=100000&minetype=image/png' },
      { test: /\.jpg/, loader: 'file' },
    ],
  },
};
```

Now `background-image: url('../icons.png');` within your module loaded CSS will inline the PNG as a data-url.

`var jpgurl = require('./assets/photo.jpg');` will bundle the JPG and return a URL to load the file when needed or to pop into the src of an image.

## Dynamic Module Names
Another rather unique feature of Webpack is it's ability to handle dynamically named modules:

``` javascript
var uniqueToThisDomain = require('./' + window.location.hostname + '/index.js');
```

By default, webpack assigns the directory of your entry point as the context. **It will bundle all potential modules within that directory.** You can change the context by setting the `context` option.

With that in mind, you have to take great care to only include files that you want bundled within your context. I found the best way is to separate your source files and destination files. I place all the modules I want bundled into the `src/` folder and compile everything to the `dist/` folder.

You can use `require.keys()` to retrieve a list of all modules bundled within that context.

Webpack, for obvious reasons, does not recursively bundle potential modules within your vendor folders. Each of those should be explicitly required. But things get really interesting as you can dynamically create new contexts.

### Auto-loading Tests
One use case is for automatically loading a subset of modules:

``` javascript
var requireTest = require.context('./', true, /_test\.js$/);
requireTest.keys().forEach(requireTest);
```

Which will recursively load all modules within the current folder that end in `_test.js`.

### Ember Resolving

An awesome feature in Ember is the resolver. You can override it to supply alternative ways to map pieces of Ember to modules. It works beautifully coupled with Webpack and dynamic contexts:

``` javascript
var App = Ember.Application.create({
  Resolver: Ember.DefaultResolver.extend({
    resolveOther: function(parsedName) {
      var pkg = this._super(parsedName);
      if (pkg) {
        // If found through the default way, return the module
        return pkg;
      }

      // If the component exists in the local context, require it
      var keys = require.keys();
      var component = './components/' + parseNamed.fullNameWithoutType;
      if (keys.indexOf(component) !== -1) {
        return require(component);
      }

      // Create a dynamic context that searches
      // node_modules for possible components
      // Any module that ends with '-ember-component'
      // and has an `index` file will be matched
      var componentRequire = require.context(
        '../node_modules/',
        true,
        /(.+)-ember-component\/index/
      );
      var vendorComponent = './' +
        parseNamed.fullNameWithoutType +
        '-ember-component/index';
      var vendorKeys = componentRequire.keys();
      if (vendorKeys.indexOf(vendorComponent) !== -1) {
        return componentRequire(vendorComponent);
      }

      // Not found
      return require('./not_found.js');
    }
  })
});
```

Now if you use a component, `{{bear-growl}}`, Ember will try the following steps:

* Search `Ember.TEMPLATES['components/bear-growl']` and `App.BearGrowlComponent`...
* Search for a local module at `app/components/bear-growl.js`...
* Search for a vendor module at `node_modules/bear-growl-ember-component/index.js`...
* Returns a `app/not_found.js` module to deal with the missing component.

### Simpler Please?
The example resolver above is a mouthful and ignores all the other parts of Ember. I created a resolver geared specifically for webpack. Check it out: [ember-webpack-resolver](https://github.com/shama/ember-webpack-resolver). It simplifies the above to:

``` javascript
var App = Ember.Application.create({
  Resolver: require('ember-webpack-resolver?' + __dirname)({
    component: [{
      context: require.context(
        '../node_modules/',
        true,
        /(.+)-ember-component\/index/
      ),
      format: '%@-ember-component/index'
    }]
  })
});
```

A more simple and less magical approach would be to explicitly require your vendor components:

``` javascript
var App = Ember.Application.create({
  Resolver: require('ember-webpack-resolver?' + __dirname)()
});
App.BearGrowlComponent = require('bear-growl-ember-component');
Ember.TEMPLATES['components/bear-growl']
  = require('bear-growl-ember-component/index.hbs');
```

More on that in another post :)

## Grunt
Webpack has a [Grunt plugin](https://github.com/webpack/grunt-webpack) and can integrate easily with your Grunt work flow:

``` shell
npm install grunt-webpack
```

``` javascript
grunt.initConfig({
  webpack: {
    build: {
      entry: 'app/index.js',
      output: {
        path: 'dist/',
        filename: 'bundle.js',
      },
    },
  },
});
grunt.loadNpmTasks('grunt-webpack');
grunt.registerTask('default', ['webpack']);
```

## Dev Server
Webpack also has a [development server](https://github.com/webpack/webpack-dev-server) that bundles on the fly without creating files. Very useful if you're looking for a quick development setup:

``` shell
npm install webpack-dev-server
```

Create an entry point `index.js` and a config `webpack.config.js` with the contents:

``` javascript
module.exports = {
  context: __dirname,
  entry: './index.js'
};
```

Now type `./node_modules/.bin/webpack-dev-server` and visit `http://localhost:8080` to view and start building an app.

## Conclusion
This is only scratching the surface of what Webpack provides (I really wanted to dive into hot code replacement but this post is already too long). Unfortunately Webpack's documentation and website isn't the best. Which could be largely why the project goes unnoticed. Tobias has always been very generous with his time and quick to respond to issues on github though.

Webpack is still very new but has a huge amount of potential. Give it a shot.
