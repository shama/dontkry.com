var createRouter = require('base-router')
var api = require('./api/index')
var posts = require('./views/posts')
var post = require('./views/post')
var about = require('./views/about')

// This is where we map routes to sources of data which get passed down to views
module.exports = createRouter({
  '/': function (params, done) {
    api.posts(function (err, data) {
      if (err) return done(err)
      done(null, posts(data))
    })
  },
  '/posts/code/:slug': postRoute('code'),
  '/posts/comics/:slug': postRoute('comics'),
  '/posts/games/:slug': postRoute('games'),
  '/about.html': function () {
    return about()
  }
}, { location: 'hash' })

function postRoute (which) {
  return function (params, done) {
    api.post(which + '/' + params.slug, function (err, data) {
      if (err) return done(err)
      done(null, post(data))
    })
  }
}
