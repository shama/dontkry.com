const html = require('yo-yo')
const moment = require('moment')
const hljs = require('highlight.js')
hljs.configure({
  languages: ['javascript', 'html', 'shell', 'plain']
})

const navView = require('./nav')
const triangleView = require('./triangle')
const footerView = require('./footer')

module.exports = function (post) {
  const content = html`<div></div>`
  content.innerHTML = post.html || ''
  highlight(content)
  return html`
    <body class="body-light">
      <header>
        <a href="/">
          ${triangleView()}
        </a>
      </header>
      ${navView()}
      <article>
        <h1>${post.context.title}</h1>
        <em>${moment(post.context.date).format('MMMM Do YYYY')}</em>
        ${content}
      </article>
      ${footerView()}
    </body>
  `
}

function highlight (el) {
  if (!el.querySelectorAll) return
  const codes = el.querySelectorAll('pre code')
  for (var i = 0; i < codes.length; i++) {
    hljs.highlightBlock(codes[i])
  }
}
