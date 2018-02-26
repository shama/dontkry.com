const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp').sync
const glob = require('glob')
const gaze = require('gaze')
const mdtohtml = require('./lib/mdtohtml')

const WATCH = process.argv[2] === '--watch'
const INPUT_PATH = path.resolve(__dirname, 'content')
const OUTPUT_PATH = path.resolve(__dirname)
const INDEX_HTML = fs.readFileSync(path.resolve(__dirname, 'index.html'))
const INDEX_JSON = require('./index.json')
const indexView = require('./app/views/index')
const postView = require('./app/views/post')

// ~

function layout (content) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>dontkry.com</title>
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
    <link rel="stylesheet" href="/index.css">
  </head>
  <body>
    ${content}
    <script src="/index.js"></script>
  </body>
  </html>
  `
}

function buildFiles (onlyFile) {
  var posts = []
  if (onlyFile) {
    readFile(onlyFile, function () {})
  } else {
    glob('**/*.html.md', { cwd: INPUT_PATH }, function (err, files) {
      var count = files.length
      function done () {
        count--
        if (count <= 0) buildIndex()
      }
      files.forEach(function (filepath) {
        readFile(filepath, done)
      })
    })
  }
  function readFile (filepath, done) {
    fs.readFile(path.resolve(INPUT_PATH, filepath), 'utf8', function (err, file) {
      if (err) return done(err)
      const slug = filepath.slice(0, -3)
      const md = mdtohtml(file)
      if (!md) return done()
      md.context.slug = '/' + slug
      delete md.context.renderer
      posts.push(md.context)

      const html = layout(postView(md).toString())
      const output = path.resolve(OUTPUT_PATH, slug)
      mkdirp(path.dirname(output))
      fs.writeFile(output, html, function () {
        console.log('created ' + output)
        done()
      })
    })
  }
  function buildIndex () {
    posts.sort(function (a, b) {
      return b.date - a.date
    })
    INDEX_JSON.posts = posts
    const json = JSON.stringify(INDEX_JSON, null, 2)
    fs.writeFile(path.resolve(OUTPUT_PATH, 'index.json'), json, function () {
      console.log('created index.json')
    })
    const html = layout(indexView(INDEX_JSON).toString())
    fs.writeFile(path.resolve(OUTPUT_PATH, 'index.html'), html, function () {
      console.log('created index.html')
    })
  }
}

// ~

buildFiles()

if (WATCH) {
  gaze('**/*.html.md', { cwd: INPUT_PATH }, function () {
    this.on('all', function (e, file) {
      if (e === 'changed') {
        buildFiles(path.relative(INPUT_PATH, file))
      } else {
        buildFiles()
      }
    })
  })
}
