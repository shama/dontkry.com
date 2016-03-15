var update = require('./app/lib/update')
var app = require('./app/index.js')
var router = require('./app/router.js')

var className = '.' + app.styles.app

// On loading, just say Loading...
router.on('loading', function (route) {
  console.time(route)
  update(className, app('Loading...'))
})

// On an error, display it
router.on('error', function (route, err) {
  update(className, app(err.toString()))
  console.timeEnd(route)
})

// On transition, render the app with the page
router.on('transition', function (route, page) {
  update(className, app(page))
  console.timeEnd(route)
})

// Check if already mounted by server side render
var mounted = document.querySelector(className)
if (!mounted) document.body.appendChild(app())

// Start on hash or /
router.transitionTo(location.pathname || '/')
