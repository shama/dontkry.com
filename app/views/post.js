var yo = require('yo-yo')
var csjs = require('csjs')
var moment = require('moment')
var hljs = require('highlight.js')
hljs.configure({
  languages: ['javascript', 'html', 'shell', 'plain']
})

module.exports = function post (post) {
  var content = yo`<div class="${styles.content}"></div>`
  content.innerHTML = post.content
  // TODO: Replace h2 with anchors
  highlight(content)
  return yo`<div class="${styles.post}">
    <div class="${styles['post-title']}">
      <h2>${post.title}</h2>
      <em>${moment(post.date).format('MMMM Do YYYY')}</em>
    </div>
    ${content}
  </div>`
}

function highlight (el) {
  var codes = el.querySelectorAll('pre code')
  for (var i = 0; i < codes.length; i++) {
    hljs.highlightBlock(codes[i])
  }
}

var styles = module.exports.styles = csjs`
.post {
  padding: 0;
  margin: 0;
}
.post-title {
  border-bottom: 1px solid #7f8c8d;
}
.content {
  clear: both;
  margin: 2em 0;
  border-bottom: 1px solid #7f8c8d;
}
.content h2 {
  margin-top: 1em;
  font-size: 1.5em;
  text-transform: uppercase;
}
.content pre {
  margin: 1em 0;
}
.content p {
  margin: 1em 0;
}
.content ul {
  margin: 1em 2em;
}
.content li {
  list-style: disc;
}
`
