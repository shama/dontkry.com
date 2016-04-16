var yo = require('yo-yo')
var moment = require('moment')

module.exports = function posts (posts) {
  return yo`<ul class="posts">
    ${posts.map(function (post) {
      return yo`<li>
        <h2><a href="/${post.slug}">${post.title}</a></h2>
        <em>${moment(post.date).format('MMMM Do YYYY')}</em>
        <p>${post.description}</p>
      </li>`
    })}
  </ul>`
}
