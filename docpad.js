module.exports = function() {
  var path = require('path');
  var _s = require('underscore.string');
  var config = {
    outPath: 'dist',
    templateData: {
      site: {
        url: 'http://dontkry.com',
        title: 'dontkry.com',
        description: '',
        keywords: '',
      },
      getPreparedTitle: function() {
        if (this.document.title) return this.document.title + ' | ' + this.site.title;
        else return this.site.title;
      },
      // convert h2 headers to anchor links
      headersToLinks: function() {
        var content = this.content;
        if (this.document.extension === 'md') {
          var headers = content.match(/<h2>(.+)<\/h2>/g);
          if (headers) {
            headers.forEach(function(header) {
              header = /<h2>(.+)<\/h2>/g.exec(header);
              var link = _s.slugify(header[1]);
              link = '<h2><a href="#' + link + '" name="' + link + '">' + header[1] + '</a></h2>';
              content = content.replace(header[0], link);
            });
          }
        }
        return content;
      },
    },
    ignorePaths: [
      path.join(__dirname, 'src', 'public', 'scss'),
      path.join(__dirname, 'src', 'public', 'js'),
    ],
  };
  return config;
};