module.exports = ->
  path = require('path')
  _s = require('underscore.string')
  config =
    outPath: 'dist'
    templateData:
      site:
        url: 'http://dontkry.com'
        title: 'dontkry.com'
        description: ''
        keywords: ''

      getPreparedTitle: ->
        if @document.title
          @document.title + ' | ' + @site.title
        else
          @site.title

      
      # convert h2 headers to anchor links
      headersToLinks: ->
        content = @content
        if @document.extension is 'md'
          headers = content.match(/<h2>(.+)<\/h2>/g)
          if headers
            headers.forEach (header) ->
              header = /<h2>(.+)<\/h2>/g.exec(header)
              link = _s.slugify(header[1])
              link = '<h2><a href=\'#' + link + '\' name=\'' + link + '\'>' + header[1] + '</a></h2>'
              content = content.replace(header[0], link)

        content

      printItems: (items) ->
        out = ''
        i = 0

        while i < items.length
          item = items[i]
          unless item.title
            item.title = item.slug
            item.url = 'http://shama.github.io/' + item.slug
          url = item.url or 'http://' + item.slug + '.com'
          out += '<li><a href=\'' + url + '\' target=\'_blank\'>'
          out += '<img src=\'images/projects/' + item.slug + '.png\' alt=\'' + item.title + '\' />'
          out += '<div>' + item.title + '</div></a>'
          out += '</li>'
          i++
        out

      # edit links to gh
      ghedit: ->
        filename = @document.relativeDirPath + '/' + @document.filename
        return '<a href="https://github.com/shama/dontkry.com/edit/master/src/documents/' + filename + '" target="_blank">edit this page</a>'

    ignorePaths: [path.join(__dirname, 'src', 'public', 'scss'), path.join(__dirname, 'src', 'public', 'js')]

    collections:
      posts: ->
        @getCollection('html').findAllLive
          relativeOutDirPath: $in: ['posts/code', 'posts/games'], [date: -1]

    plugins:
      rss:
        collection: 'posts'
