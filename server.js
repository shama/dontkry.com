var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp').sync
var app = require('./app/index.js')
var router = require('./app/router.js')

var dist = path.join(__dirname, 'dist')
mkdirp(dist)

// These are the routes we would like to generate
var routes = process.argv.slice(2)
routes.push.apply(routes, [
  '/',
  '/about.html'
])
router.transitionTo(routes.shift())

// On each transition, build each page
router.on('transition', function (route, page) {
  var html = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>dontkry.com</title>
    <link rel="stylesheet" href="/index.css" />
  </head>
  <body>
    ${app(page).outerHTML}
    <script src="/index.js"></script>
  </body>
  </html>`
  if (route.slice(-3) === '.md') {
    route = route.slice(0, -3)
  }
  var filename = route === '/' ? '/index.html' : route
  filename = path.join(dist, filename)
  mkdirp(path.dirname(filename))
  fs.writeFile(filename, html, function () {
    var nextRoute = routes.shift()
    if (nextRoute) {
      router.transitionTo(nextRoute)
    } else {
      require('remote').require('app').quit()
    }
  })
})

router.on('error', function (route, err) {
  console.log('err', route, err)
  router.transitionTo(routes.shift())
})
