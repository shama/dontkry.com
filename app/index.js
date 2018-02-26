const html = require('yo-yo')
const xhr = require('xhr')
const createRouter = require('base-router')
const mdtohtml = require('../lib/mdtohtml')
const index = require('../index.json')

const router = createRouter({
  '/': function () {
    return require('./views/index')(index, emit)
  },
  '/posts/code/:slug': mdroute('/content/posts/code/'),
  '/posts/comics/:slug': mdroute('/content/posts/comics/'),
  '/posts/games/:slug': mdroute('/content/posts/games/'),
})

function mdroute (route) {
  return function (params, done) {
    xhr({
      uri: route + params.slug + '.md',
      beforeSend: function (xhrObject) {
        xhrObject.onprogress = function (e) {
          //debugger
        }
      }
    }, function (err, res) {
      const md = mdtohtml(res.body)
      const view = require('./views/post')(md)
      done(null, view)
    })
  }
}

// Pool action calls here
function emit (name, arg) {
  switch (name) {
    case 'transitionTo':
      router.transitionTo(arg)
      break
  }
}

// Update the HTML on transition
router.on('transition', function (route, content) {
  html.update(document.body, content)
})

// Whoops we got a routing error
router.on('error', function (route, err) {
  html.update(document.body, require('./views/404')(route))
})

// Capture all non-outgoing clicks to call transitionTo instead
document.addEventListener('click', function (e) {
  if (e.target.nodeName === 'A' && e.target.getAttribute('target') !== '_blank') {
    e.preventDefault()
    router.transitionTo(e.target.getAttribute('href'))
  }
}, false)

// Start it
router.transitionTo(location.pathname || '/')
