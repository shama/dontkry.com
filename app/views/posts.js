var yo = require('yo-yo')
var csjs = require('csjs')
var moment = require('moment')

module.exports = function posts (posts) {
  return yo`<ul class="${styles.posts} posts">
    ${posts.map(function (post) {
      return yo`<li>
        <h2><a href="/#/posts/${post.slug}">${post.title}</a></h2>
        <em>${moment(post.date).format('MMMM Do YYYY')}</em>
        <p>${post.description}</p>
      </li>`
    })}
  </ul>`
}

var styles = module.exports.styles = csjs`
.posts {
  padding: 0;
  margin: 0;
}
.posts li {
  list-style: none;
  border-bottom: 1px solid #7f8c8d;
  padding: 0 0 .5rem 0;
  margin: 0 0 1rem 0;
}
.posts li:hover {
  transition: padding-bottom .3s;
  padding-bottom: 1rem;
}
.posts h2 {
  text-transform: uppercase;
}
.posts a {
  text-decoration: none;
}
.posts p {
  padding: 0;
  margin: 0;
  font-size: .8rem;
}
`
