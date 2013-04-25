module.exports = function() {
  var path = require('path');
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
    },
    ignorePaths: [
      path.join(__dirname, 'src', 'public', 'scss'),
      path.join(__dirname, 'src', 'public', 'js'),
    ],
  };
  return config;
};