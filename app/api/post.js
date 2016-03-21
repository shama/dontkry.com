var fs = require('fs')
var path = require('path')
var nets = require('nets')
var mdtohtml = require('../lib/mdtohtml')

module.exports = function api_post (slug, done) {
  if (process.browser) {
    nets({
      url: '/content/posts/' + slug + '.md'
    }, function (err, res, body) {
      if (err) return done(err)
      resultToPost(body, slug, done)
    })
  } else {
    var filename = path.join(__dirname, '..', '..', 'content', 'posts', slug)
    fs.readFile(filename, function (err, body) {
      if (err) return done(err)
      resultToPost(body, slug, done)
    })
  }
}

function resultToPost (res, slug, done) {
  var html = mdtohtml(res)
  if (!html) return done(new Error('Invalid markdown file.'))
  done(null, {
    title: html.context.title,
    slug: slug,
    date: html.context.date,
    content: html.html
  })
}
