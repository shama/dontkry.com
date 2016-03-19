---
layout: post
title: "Modules: The Right Way"
description: "A mindful exploration into modules"
date: 2013-10-22
---
A module done "the right way" primarily means: it works. It doesn't error or run code in an unexpected way when you're deploying, have other developers running your code or come back to update a project some time in the future. Other problems like files space and ease of use should be secondary concerns.

I am using the term "modules" in the most generic sense of the word. These concepts can apply to your project structure, package manager or the very way you write code. I'll attempt to explain these concepts a generic way then provide real world examples.

## Global Dependencies
Global systems are classic where all your dependencies reside in a single location. Then multiple applications consume those dependencies from the same pool.

```
| - modules
| --- bear extends MODULES/animal
| --- animal
| - apps
| --- grizzly extends MODULES/bear
| --- polar extends MODULES/bear
| --- panda extends MODULES/bear
```

Upon initial consideration this structure seems ideal. It takes up the least amount of file space and all of your modules are located in one convenient place. All of your applications point to the same module so it is really easy to update that module across all of your projects.

For these reasons this structure is commonly used... but **it is incredibly flawed**.

### TECHNICAL ISSUES
Updating modules, for most systems, happens frequently. Backwards compatibility and good versioning are not a guarantee. Updating modules will eventually break your apps. Global dependencies mean you are forced to update **ALL** of your apps each time you update a global dependency. 

So unless you only have a couple of projects, keeping every project in step with dependency updates is a nightmare and most of the time not even physically possible.

### SOCIAL ISSUES
Global dependencies are not easily shareable as they rely on an environment setup outside of the project. Which usually requires a project to request users (usually via a bulleted list of steps in a readme) or provide a switching mechanism to recreate the environment in order to run the project. 

For diverse teams, especially open source software teams with developers contributing to a diverse array of projects, **this is not practical**.

### EXAMPLE
You plan on building websites for various clients throughout the year. You create a project folder for each client and use the same utility scripts for every project. So lazily you place those utilities in a single folder and then consume it with each project:

``` javascript
// /Users/dude/scripts/utils.js
var utils = module.exports = {};
utils.slug = function(str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};
```

and then within each of your projects:

``` javascript
// /Users/dude/projects/acme/blog.js
var utils = require('/Users/dude/scripts/utils.js');
var title = utils.slug('Acme Blog Post'); // acme-blog-post
```

Over time business is doing well and you add more and more projects. One day a client enters the blog title "Blogs - How do they work?" and the slug produced is `blogs---how-do-they-work`. They complain and you update your slug utility:

``` javascript
utils.slug = function(str) {
  return str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};
```

Which will produce the more desired `blogs-how-do-they-work`.

Now every single past project that used to rely on the previous slug format is broken. You won't realize this until you're doing updates on a past project. You'll likely find out your client's pages are now 404ing because they're URLs are changing as they update. Fun times.

I'm sure you can think of a way to retain backwards compatibility for this simple one line function. But the point is, when editing a global dependency you must be mindful of every single project that uses it. That is difficult and unnecessary for a developer and nearly impossible for a development team.

**Global dependencies will eventually produce broken code.**

Instead you should turn that utility into a module and install it locally into every project. Working code is far more important than saving a few kilobytes of file space.

## Flat Dependencies
A flat structure or peer dependencies is a step towards the right way. Each project has its own `modules` location so each project can be updated only as needed. Each project is also shareable as the user can recreate the environment quickly within the project folder to run the app.

```
| - apps
| --- grizzly extends modules/bear
| ----- modules
| ------- bear extends animal
| ------- animal
| --- polar extends modules/bear
| ----- modules
| ------- bear extends animal
| ------- animal
| --- panda extends modules/bear
| ----- modules
| ------- bear extends animal
| ------- animal
```

Flat dependency structures only work well for projects with a small amount of dependencies. They are also easily accessible since every module is located just one folder down.

This structure begins to break down when the module tree becomes diverse. Our `grizzly` needs to eat let's give him some `fish` which extends the `animal` module:

```
| - grizzly@0.1.0
| --- modules
| ----- fish@0.1.0 extends animal@0.1.0
| ----- bear@0.1.0 extends animal@0.1.0
| ----- animal@0.1.0
```

### TECHNICAL ISSUES
Everything is golden until `animal` updates to `0.2.0`. The maintainer of `bear` is active and updates to `animal@0.2.0`. You're working on `grizzly@0.2.0` which now relies on `bear@0.2.0`. But unfortunately the maintainer of `fish` doesn't have time to update.

What do you do? Keep `bear@0.1.0` until the maintainer of `fish` gets time to update? You have a deadline that requires those features in `bear@0.2.0`! Likely at this point you'll be writing hacks to get `fish` to work *good enough*.

### SOCIAL ISSUES
Flat modules can break when another unanticipated module updates. This puts pressure on the developer ecosystem to couple their modules together to avoid these potential conflicts. Which is why small, tight knit teams with minimal dependencies **get by** with this approach.

Open source software progresses through diversity. I believe a module structure should encourage module decoupling. Developers shouldn't have to think and keep up with an entire ecosystem just to build a single module.

### EXAMPLE
Frameworks are a great example of modules that create peer dependent situations.  
Let's create an Acme framework:

``` javascript
var acme = module.exports = {
  config: {
    user: 'Dude'
  },
  announce: function() {
    console.log('Hi! My name is ' + this.config.user);
  },
};
```

Now each Acme plugin requires an instance of the Acme object. Let's create a plugin:

``` javascript
module.exports = function(acme) {
  if (acme.config.user) acme.announce.call(acme);
  else console.log('User not found');
};
```

The plugin doesn't consume Acme as a dependency but the instance of Acme is required for the plugin to run. Therefore it is a peer dependency.

This architecture seems convenient from a plugin author perspective but it has a couple of problems:

* Down the road new versions of the Acme framework are released. Each project can only have one version of your Acme framework installed. The user is forced to upgrade every single plugin they use in order to use the new version of your framework.
* Your plugin will only work with the Acme framework. You should be a good open source citizen and make your plugin generic. Then users of other frameworks or users who don't use a framework can consume your code. We don't need the same code written over and over custom tailored to each framework.

**Frameworks should encourage generic plugins.**

Here is a more generic approach that doesn't require an instance of acme thus removing the peer dependency:

``` javascript
// framework
var acme = module.exports = {
  config: {},
  announce: function() {
    console.log('Hi! My name is ' + this.config.user);
  },
};

// plugin
var acme = require('acme');
module.exports = function(config) {
  acme.config = config;
  if (config.user) acme.announce.call(acme);
  else console.log('User not found');
};
```

Now your plugin is future proof and available to everyone.

## Nested Dependencies
Nested dependencies solve the issues of global and flat systems. Each module is its own project. These modules are portable and encapsulated.

```
| - apps
| --- grizzly extends modules/bear
| ----- modules
| ------- bear extends modules/animal
| --------- modules
| ----------- animal
| --- polar extends modules/bear
| ----- modules
| ------- bear extends modules/animal
| --------- modules
| ----------- animal
| --- panda extends modules/bear
| ----- modules
| ------- bear extends modules/animal
| --------- modules
| ----------- animal
```

Nested dependencies completely solve the versioning problem of the flat system:

```
| - grizzly@0.2.0
| --- modules
| ----- fish@0.1.0 extends animal@0.1.0
| ------- animal@0.1.0
| ----- bear@0.2.0 extends animal@0.2.0
| ------- animal@0.2.0
```

This a safe approach. Each module author only has to worry about their own dependencies. Thus allowing the ecosystem to thrive exponentially and operate with stability.

### TECHNICAL ISSUES
Duplication, everywhere. In order to ensure each module is protected, it needs to carry a copy of all its dependencies. For naive systems, this is a problem, as you can end up bundling the same module more than once.

Access to a dependency of a nested module is limited as well but rightly so. Those are not your dependencies. They belong to the module. First level modules are your dependencies. If you need to access `animal` then it should be duplicated on the first level of your modules.

### SOCIAL ISSUES
Responsibility. When an issue does arise, tracking down the problem and reporting to the appropriate maintainer is difficult. Even more so as each release of the module can switch to an entirely new set of modules and maintainers.

For copyright lawyers in a corporate environment staying on top of licensing can be a chore. Each module usually consists of multiple disconnected maintainers that can either be extremely active or for some reason have disappeared from the face of the earth.

### EXAMPLE
[npm](npmjs.org) is a fine example of nested dependencies and is hailed as the greatest package manager for good a reason. It has thought about and solved all of the above issues.

**npm does modules the right way** but still gives you the option to do it the wrong way.

* **Globals Dependencies?**  
npm defaults to local installs with an option to install globally with `-g` or `--global`.
* **Flat/Peer Dependencies?**  
npm will read the `peerDependencies` key of your `package.json` as an option to install them as neighbors to your package.
* **Developer Friendly?**  
Use `npm link` in the project you're developing and `npm link <package>` to link the development package into your project. [https://npmjs.org/doc/cli/npm-link.html](https://npmjs.org/doc/cli/npm-link.html)
* **Duplication?**  
Use `npm dedupe` which will intelligently reduce the duplication in your package tree by moving common semver compatible dependencies up. [https://npmjs.org/doc/cli/npm-dedupe.html](https://npmjs.org/doc/cli/npm-dedupe.html)
* **License/Issue Resolution?**  
npm has a page for each package listing the license, repo, homepage and bugs (as configured by the author).

The best part is if you still don't agree npm is the right for you; it has a great API. Rather than starting from scratch just extend npm through it's API and add the features you need.

## Conclusion
I believe modules should try to be small and decoupled. No single or group of maintainers should have control over any part of an open source ecosystem; only their own modules. I judge the success of an ecosystem based on how well it thrives outside the reach of it's creators.

I encourage you to be mindful when structuring your code, mindful of the ecosystem when creating a framework or sharing code and mindful of the package managers your module is aimed towards.
