var fs = require('fs')
var path = require('path')
var nets = require('nets')

module.exports = function api_posts (done) {
  if (process.browser) {
    nets({
      url: '/content/index.json',
      json: true
    }, function (err, res, index) {
      if (err) return done(err)
      done(null, index.posts)
    })
  } else {
    var index = require(path.join(__dirname, '..', '..', 'dist', 'content', 'index.json'))
    done(null, index.posts)
  }
}
