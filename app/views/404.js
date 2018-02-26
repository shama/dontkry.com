const html = require('yo-yo')
const navView = require('./nav')
const triangleView = require('./triangle')
const footerView = require('./footer')

module.exports = function (page) {
  return html`
    <body class="body-dark">
      <header>
        <a href="/">
          ${triangleView()}
        </a>
      </header>
      ${navView()}
      <article>
        <h3>Error 404</h3>
        <p>The route ${page} does not exist.</p>
      </article>
      ${footerView()}
    </body>
  `
}
