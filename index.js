var document = require('global/document')
var update = require('./app/lib/update')
var app = require('./app/index.js')
var router = require('./app/router.js')

var className = '.app'

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

// Capture all non-outgoing clicks to call transitionTo instead
document.addEventListener('click', function (e) {
  if (e.target.nodeName === 'A' && e.target.getAttribute('target') !== '_blank') {
    e.preventDefault()
    router.transitionTo(e.target.getAttribute('href'))
  }
}, false)

// Check if already mounted by server side render
var mounted = document.querySelector(className)
if (!mounted) document.body.appendChild(app())

// Start on hash or /
router.transitionTo(location.pathname || '/')
