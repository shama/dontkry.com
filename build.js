var path = require('path')
var fs = require('fs')
var yfm = require('yfm')
var glob = require('glob')
var electron = require('electron-spawn')
var mkdirp = require('mkdirp').sync
var browserify = require('browserify')

var mdtohtml = require('./app/lib/mdtohtml')
var app = require('./app/index.js')
var router = require('./app/router.js')

// paths
var dist = path.join(__dirname, 'dist')
var indexPath = path.join(dist, 'content', 'index.json')
var postsPath = path.join(__dirname, 'content')
mkdirp(dist)
mkdirp(path.dirname(indexPath))

glob('**/*.html.md', { cwd: postsPath }, function (err, files) {
  var posts = []
  var postsRoutes = []

  // Convert each post into html
  files.forEach(function (slug) {
    var filepath = path.join(postsPath, slug)
    var md = mdtohtml(fs.readFileSync(filepath))
    if (!md) return
    postsRoutes.push('/' + slug)
    posts.push({
      title: md.context.title,
      date: md.context.date,
      description: md.context.description,
      slug: slug.slice(0, -3)
    })
    // Copy the raw md content
    // TODO: Convert to HTML here? Weird file DB you got KRY
    var outFilepath = path.join(dist, 'content', slug)
    mkdirp(path.dirname(outFilepath))
    fs.createReadStream(filepath)
      .pipe(fs.createWriteStream(outFilepath))
  })

  // Sort by date descending
  posts.sort(function (a, b) {
    return b.date - a.date
  })

  // Create the index
  var index = JSON.stringify({
    posts: posts
  }, null, 2)
  fs.writeFileSync(indexPath, index)

  compileHTML(postsRoutes, function () {
    compileCSS()
    compileJS()
  })
})

function compileJS () {
  var b = browserify()
  b.add(path.join(__dirname, 'index.js'))
  b.bundle().pipe(fs.createWriteStream(path.join(dist, 'index.js')))
}

function compileCSS () {
  // TODO: Extract out the CSS rather than use csjs-injectify
  fs.createReadStream(path.join(__dirname, 'app', 'css', 'index.css'))
    .pipe(fs.createWriteStream(path.join(dist, 'index.css')))
}

function compileHTML (posts, done) {
  posts.unshift(path.join(__dirname, 'server.js'))
  var child = electron.apply(electron, posts)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  child.on('exit', done)
}
