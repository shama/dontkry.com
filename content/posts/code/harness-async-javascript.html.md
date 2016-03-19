---
layout: post
title: "Harness Async JavaScript"
description: ""
date: 2015-01-30
---

Knowing how to harness asynchronous behavior is fundamental in JavaScript.

## What is Async JavaScript?

To put simply, any call that will finish executing at a later time.

Such as if we wanted to find the `width` of a image somewhere on the internet:

```javascript
var img = new Image()
img.src = 'http://animals.com/bear.png'
console.log('Width is ' + img.width)
```

You'll discover this isn't correct as the `img.width` is `0`. It is only available **after** the image has loaded. Setting `img.src` invokes an async operation. You can only determine the `width` of the image once it has finished loading.

`Image` will tell you when it has finished through a `onload` callback hook. Basically saying, I'll call the `function` you gave `onload` when the image has finished loading:

```javascript
var img = new Image()
img.onload = function() {
  console.log('Width is ' + img.width)
}
img.src = 'http://animals.com/bear.png'
```

## Harnessing Async

Unlike `Image`, there are many operations in JavaScript in which you can choose whether to be asynchronous or synchronous. For most things, the simple choice is **sync** as it's easier read and understand.

For example, if we have an array of animals and we want to filter out any non-bear animal from the array, we could do:

```javascript
var animals = [ { type: 'bear', name: 'grizzly'}, /* ... */ ]
var bears = animals.filter(function(animal) {
  return animal.type === 'bear'
})
console.log('Bears: ', bears)
```

We are able to `console.log` the bears immediately after. Even though `filter` takes a callback, it is still a **sync** operation.

### Make it async

Now why would we ruin a perfectly easy **sync** operation? Because JavaScript is single threaded (*mostly*). If you had 1000s of animals to search through or the `filter` callback was an expensive operation, you'll block the thread. Your UI will lag or your server would stop serving until the filter has finished.

Let's make that filter operation **async** by writing a our own `filter` helper function:

```javascript
// A helper function for filtering arrays without blocking
function filter(array, next, done) {
  var count = 0
  var results = []
  var iterate = function() {
    next(array[count], function(pass) {
      if (pass) results.push(array[count]) // order not guaranteed
      count++
      if (count >= array.length) done(results)
      else setImmediate(iterate) // this is important!
    })
  }
  iterate()
}
```

Now let's create a large array of animals, remember this `for` loop will block your thread until it has finished. It is not async:

```javascript
// Add lots of animals! This part will block
var animals = []
for (var i = 0; i < 999999; i++) {
  animals.push({ type: (Math.random() > .5 ? 'bear' : 'fish') })
}
```

Now we can use our async `filter` helper to filter out any non-bears but it will **not block** the `setInterval` from printing `'dont block!'` every 100ms:

```javascript
// Every 100ms we'll log, our filter should not block this
var interval = setInterval(function() {
  console.log('dont block!')
}, 100)

// Now filter our animals without blocking
filter(animals, function(animal, next) {
  next(animal.type === 'bear')
}, function(bears) {
  console.log('We have ' + bears.length + ' bears.')
  clearInterval(interval)
})
```

**[setImmediate](https://developer.mozilla.org/en-US/docs/Web/API/Window.setImmediate)** is important to make this work. This instructs our `filter` helper to only iterate once the browser has completed other operations. Thus avoids blocking our thread.

### Third Party Libraries

There are many async helper libs on [npmjs.com](https://www.npmjs.com/search?q=async). A popular one is [async](https://www.npmjs.com/package/async) which has a laundry list of flow control helpers.

> In my experience, `setImmediate` is usually not baked into flow control libraries. Be sure to check and call `setImmediate` if the library does not to avoid blocking.

## Callback Paths

Callbacks are the quintessential way of harnessing async. One could easily run to a helper library to deal with an async issue but many situations are easily handled with a little knowledge of callbacks.

[Node.js](http://nodejs.org) / [io.js](https://iojs.org/) heavily utilize callbacks and offers both sync and async versions of most methods. For the same reasons discussed above reguarding blocking, you should prefer the async methods.

A common annoyance when using callbacks is ["callback hell"](http://callbackhell.com/) or overly nested callbacks:

```javascript
var fs = require('fs')

fs.lstat('big.file', function(err, stat) {
  fs.readFile('big.file', function(err, contents) {
    var uppercased = contents.toString().toUpperCase()
    fs.writeFile('uppercased.file', uppercased, function(err) {
      console.log('All done!')
    })
  })
})
```

The nesting can quickly become undesirable but this is easily overcome by creating a callback path. Any time you're nesting more than desired, create a function at the same level as the initial function scope and use that as the callback:

```javascript
var fs = require('fs')

fs.lstat('big.file', function(err, stat) {
  fs.readFile('big.file', writeFile)
})

function writeFile(err, contents) {
  var uppercased = contents.toString().toUpperCase()
  fs.writeFile('uppercased.file', uppercased, function(err) {
    console.log('All done!')
  })
}
```

After `fs.readFile('big.file', writeFile)` is finished it will call your `writeFile` function.

## Callback Chunks

Another common async pattern is needing to perform a number of async operations and know when all have finished:

```javascript
var fs = require('fs')
var request = require('request')

function readFiles(done) {
  var files = []
  var count = 3
  function next(err, contents) {
    files.push(contents.toString())
    if (count < 1) done(files)
  }
  // Read 2 files and request 1 from a remote server
  fs.readFile('one.file', next)
  request('http://example.com/two.file', function(err, response, body) {
    next(err, body)
  })
  fs.readFile('three.file', next)
}

readFiles(function(files) {
  console.log('Got ' + files.length + ' files')
})
```

Each async call here, `fs.readFile` and `request`, will call the `next()` function when they are done. We simply count how many we expect to finish and then call `done()` once they all have finished.

Callbacks are a simple and raw method of dealing with async operations.

## Promises

As of this writing, [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) are available in [io.js](https://iojs.org/es6.html) and [most modern browsers](http://caniuse.com/#feat=promises). Support is easily supplemented through third party libraires such as [Q](https://www.npmjs.com/package/q), [RSVP](https://www.npmjs.com/package/rsvp), [bluebird](https://www.npmjs.com/package/bluebird). Amongst many [promise flavored libraries](https://www.npmjs.com/search?q=promise) on npm.

For many, especially the end user, they make dealing with async very composable.

A promise is an object that will callback either `then` upon success or `catch` upon failure. Upon cursory glance, this doesn't seem to solve "callback hell" as promises still use callbacks.

Rather it's the ability to `return` a promise from within a callback that allows for chaining to avoid callback hell:

```javascript
var fs = require('fs-promise')

fs.lstat('big.file').then(function(stat) {
  return fs.readFile('big.file') // file exists, read a file and return the promise
}).then(function(contents) {
  // The contents argument here is from the promise
  // returned in the previous callback
  var uppercased = contents.toString().toUpperCase()
  return fs.writeFile('uppercased.file', uppercased)
}).then(function() {
  console.log('All done!')
}).catch(function(err) {
  console.error(err)
})
```

Or if you need to perform a number of async operations, use `Promise.all`:

```javascript
var fs = require('fs-promise')
var request = require('request')

Promise.all([
  fs.readFile('one.file'),
  new Promise(function(resolve, reject) {
    request('http://example.com/two.file', function(err, response, body) {
      if (err) reject(err)
      resolve(body)
    })
  },
  fs.readFile('three.file'),
]).then(function(files) {
  console.log('Got ' + files.length + ' files')
})
```

This runs all the promises within the array asynchronously. The order they run is not guaranteed.

Running each promise in a series, sequential order or one after the other is solved with clever usage of `Array.reduce`. Remember promises are just objects that can be consumed through existing JavaScript patterns:

```javascript
var fs = require('fs-promise')

new Array([
  fs.writeFile('first.file', '1'),
  fs.writeFile('second.file', '2'),
  fs.writeFile('third.file', '3'),
]).reduce(function(current, next) {
  return current.then(next)
}, Promise.resolve()).then(function() {
  console.log('All done!')
})
```

> Be aware that many third party libraries add their own promise flavoring. Use caution when choosing a promise supplemental library as it may break compatibility with implemented [promise specs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## Generators

As of this writing, [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) are available in [io.js](https://iojs.org/es6.html) and most [most modern browsers](http://kangax.github.io/compat-table/es6/#generators).

Generators are functions in which their execution can be iterated through. Or as I like to think of them: **lazy functions with mutliple return-like expressions.**

Take this example:

```javascript
function *createStep() {
  console.log('log begin')
  yield 'first'
  console.log('log middle')
  yield 'second'
  console.log('log end')
  yield 'third'
}
var step = createStep()
step.next() // returns { value: 'first', done: false }
// log begin
step.next() // returns { value: 'second', done: false }
// log middle
step.next() // returns { value: 'third', done: true }
// log end
```

We built a function that creates an iterator. Each call to `next()` on the iterator executes to the next `yield` expression and then pauses, without blocking. It will continue to iterate until it reaches the end of the function.

Since it is an iterator, you can also loop through using `for..of`:

```javascript
for (var step of createSteps()) {
  console.log(step.value) // first, second, third
}
```

### Async With Generators

So what is the big deal and how does this help writing async code?

It enables us to write a little helper that utilizes `yield`'s behavior. Here is a suspend/resume helper; modified but originally based upon [creationix's gist](https://gist.github.com/creationix/5761021) which in turn was originally derived from the syntax in [suspend](https://www.npmjs.com/package/suspend):

```javascript
function run(generator) {
  var data = null, yielded = false
  var iterator = generator(function() {
    data = arguments
    check()
  })
  yielded = !!(iterator.next())
  check()
  function check() {
    while (data && yielded) {
      var err = data[0], item = data[1]
      data = null
      yielded = false
      if (err) return iterator.throw(err)
      yielded = !!(iterator.next(item))
    }
  }
}
```

This helper says: run this generator pausing at each `yield` and continuing after each call to `resume()`.

Which lets us write async code as if it were sync:

```javascript
run(function*(resume) {
  try {
    var lstat = yield fs.lstat('big.file', resume)
  } catch (err) {
    console.error('File does not exist: ', err)
  }
  var contents = yield fs.readFile('big.file', resume)
  var uppercased = contents.toString().toUpperCase()
  yield fs.writeFile('uppercased.file', uppercased, resume)
  console.log('All done!')
})
```

`yield` is an expression. The right of `yield` will be returned as `iterator.next().value`. But you can also send in values as we are doing above with `iterator.next(value)`. That value sent in can be assigned to the left of `yield`.

### Third Party Libraries

The above helper is just one flavor of utilizing generators. Check out the [suspend](https://www.npmjs.com/package/suspend) library for more robust suspend/resume helpers.

## Conclusion

You can write a book on either callbacks, promises or generators alone. This post was intented on introducing and encouraging you to be comfortable writing async code.

As async it is absolutely paramount when writing JavaScript.
