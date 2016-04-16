var yo = require('yo-yo')
var moment = require('moment')
var hljs = require('highlight.js')
hljs.configure({
  languages: ['javascript', 'html', 'shell', 'plain']
})

module.exports = function post (post) {
  var content = yo`<div class="post-content"></div>`
  content.innerHTML = post.content
  //injectScripts(content, post.slug)
  // TODO: Replace h2 with anchors
  highlight(content)
  return yo`<div class="post">
    <div class="post-title">
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

// function injectScripts (el, slug) {
//   var scripts = el.querySelectorAll('script')
//   for (var i = 0; i < scripts.length; i++) {
//     var script = scripts[i]
//     var url = '/content/posts/' + slug + '/' + script.textContent
//     // var s = document.createElement('script')
//     // s.src = url
//     // document.body.appendChild(s)
//     // console.log(url)
//   }
//   //console.log(scripts)
// }
