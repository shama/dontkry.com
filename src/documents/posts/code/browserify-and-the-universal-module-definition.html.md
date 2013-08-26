---
layout: post
title: "Browserify and the Universal Module Definition"
description: "How I Learned to Stop Worrying and Love the Browserify"
date: 2013-06-14
---
## How I Learned to Stop Worrying and Love the Browserify

Defining a module is really simple but like all simple things; none of us can agree on just one. While this is generally true for all communities it is especially erratic in the javascript community. This is not really javascript's fault though. It's not easy being an extremely flexible, loosely interpreted language available on just about every platform.

The current actively used module definitions are:

###  Global Variables
``` javascript
// MyDependency is in your global scope
var MyModule = function() {};
```

### CommonJS
``` javascript
var MyDependency = require('my-dependency');
module.exports = function() {};
```

### AMD
``` javascript
define(['my-dependency'], function(MyDependency) {
  return function() {};
});
```

## Universal Access
Typically you want your module to be easily consumed by the users of all of these module definitions. So the prudent module author will opt for the Universal Module Definition:

``` javascript
(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('b'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['b'], function (b) {
      return (root.returnExportsGlobal = factory(b));
    });
  } else {
    // Global Variables
    root.returnExportsGlobal = factory(root.b);
  }
}(this, function (b) {
  // Your actual module
  return {};
}));
```

WAT. Yes that works and you're an awesome module author for taking that extra step in making your module universal. But let's be honest. That is a mess. I don't want to include that in all of my modules.

The truth is most authors won't configure UMD in all their modules or if they do; they likely will do it wrong rendering the a definition ineffective or just plain broken.

> **Update:** [@BlaineBublitz](http://twitter.com/BlaineBublitz) pointed out the above UMD wrapper is incorrect as the AMD build tools will expose `exports` as an object. Thus we should check for AMD first for the above to actually work. 

> The funny thing is, I copied the above UMD example directly from [https://github.com/umdjs/umd](https://github.com/umdjs/umd). I don't want this post to rag on UMD because UMD has very good intentions. But it kind of drives the point home that even UMD's own examples are incorrect.

> **Update 2:** Kudos to [@BlaineBublitz](http://twitter.com/BlaineBublitz) for sending a pull request and fixing this issue: [https://github.com/umdjs/umd/commit/992cc0d071b7ebcd7feaad2a5349bdbeab09a0fe](https://github.com/umdjs/umd/commit/992cc0d071b7ebcd7feaad2a5349bdbeab09a0fe).

## ES6 to the Rescue?
Harmony is on horizon and it includes a module definition:

``` javascript
import { MyDependency } from 'my-dependency';
export function mymodule() {}
```

Hooray! We're done... or are we? This may seem like the holy grail but it has a few problems:

### It Technically Doesn't Exist Yet
ES6 isn't here yet so this definition isn't an option at the moment. It will be awhile before this option is available in Node.js and the browsers. Even longer until you can safely use it universally (think about IE).

### Will *Everyone* Use It?
Just because javascript includes a module definition doesn't mean everyone will use it. Some of the more prominent members of the javascript community have already spoken out against it. Throw in the authors who don't know about it and we might have just yet another module definition.

### Can UMD Detect It?
During the transition to ES6 modules, what will UMD look like? Can it natively detect if a module is using the `export` keyword? I don't think it can (please correct me if I'm wrong). You could build a shim for it but ultimately you're just creating yet another module definition.

## The Solution
Stop worrying and use a build tool. Pick whatever module definition you like. Then transform the modules as you build.

### What About Those Who Don't Want to Use a Build Tool?
Too bad for them. Think about the audience you're catering to. They are copying and pasting your module into files and adding a bunch of script tags to their page. Those users should have no problem also modifying your module to fit their needs. If anything by not catering to that use case you're doing them a favor by pushing them to a better workflow.

## [Browserify](http://browserify.org/)
[Browserify](http://browserify.org/) is a great build tool for this. Through transforms it enables you to consume any module.

Install browserify with: `npm install browserify -g`

### CommonJS
Browserify works natively with the CommonJS module definition:

``` bash
browserify main.js -o bundle.js
```

which will produce a `bundle.js` file.

It can be included on your page with:

``` html
<script src="bundle.js"></script>
```

### AMD
Browserify can consume AMD modules with [deamdify](https://npmjs.org/package/deamdify):

``` bash
npm install deamdify
browserify -t deamdify main.js -o bundle.js
```

### Global Variables
Browserify can consume globals as well with [deglobalify](https://npmjs.org/package/deglobalify):

``` bash
npm install deglobalify
browserify -t deglobalify main.js -o bundle.js
```

### ES6
What about harmony? Yep! Use [es6ify](https://npmjs.org/package/es6ify):

``` bash
npm install es6ify
browserify -t es6ify main.js -o bundle.js
```

## Browserify Universally
You can use multiple transforms in one swoop and have universal module access:

``` bash
npm install deamdify es6ify deglobalify
browserify -t deamdify -t es6ify -t deglobalify main.js -o bundle.js
```

## NOT USING npm?
We've got a transform for that: [decomponentify](https://npmjs.org/package/decomponentify) and [debowerify](https://npmjs.org/package/debowerify).

## Integration with Grunt
You can use transforms with [grunt-browserify](https://npmjs.org/package/grunt-browserify) to integrate into your Grunt workflow as well:

``` bash
npm install grunt-browserify grunt deamdify deglobalify \
debowerify decomponentify --save-dev
```

In your `Gruntfile.js`:

``` javascript
grunt.initConfig({
  browserify: {
    all: {
      src: 'main.js',
      dest: 'bundle.js',
      options: {
        transform: ['debowerify', 'decomponentify', 'deamdify', 'deglobalify'],
      },
    },
  },
});
grunt.loadNpmTasks('grunt-browserify');
```

Now I can consume any package from `npm`, `bower`, `component` or globally defined script simply by typing: `grunt browserify`.

## Conclusion
I seriously doubt all of us will ever agree and use a single module definition.

So stop worrying and love the browserify.

