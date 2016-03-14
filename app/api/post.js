var fs = require('fs')
var path = require('path')
var nets = require('nets')
var mdtohtml = require('../lib/mdtohtml')

module.exports = function api_post (slug, done) {
  if (process.browser) {
    nets({
      url: '/app/content/posts/' + slug
    }, function (err, res, body) {
      if (err) return done(err)
      resultToPost(body, done)
    })
  } else {
    var filename = path.join(__dirname, '..', 'content', 'posts', slug)
    fs.readFile(filename, function (err, body) {
      if (err) return done(err)
      resultToPost(body, done)
    })
  }
}

function resultToPost (res, done) {
  var html = mdtohtml(res)
  if (!html) return done(new Error('Invalid markdown file.'))
  done(null, {
    title: html.context.title,
    slug: html.context.slug,
    date: html.context.date,
    content: html.html
  })
}
