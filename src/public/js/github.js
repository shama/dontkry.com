var path = require('path');
var grunt = require('grunt');
var Github = require('github-js');

var secret = require('../secret.json');
var github = Github.new({
  username: secret.user,
  password: secret.password,
  auth: 'basic'
});

var tmp = path.resolve(__dirname, '..', 'tmp');
if (!grunt.file.exists(tmp)) grunt.file.mkdir(tmp);

function cache(name, value) {
  var filename = path.join(tmp, name);
  if (!value && grunt.file.exists(filename)) {
    return grunt.file.readJSON(filename);
  }
  if (name && value) {
    return grunt.file.write(filename, JSON.strigify(value));
  }
  return false;
}

var GH = module.exports = {};

GH.featuredRepos = function(repos, done) {
  if (!repos) return done([]);
  return done(repos.map(function(repo) {
    var cached;
    if ((cached = cache('repo-' + repo))) return cached;
    GH.repoInfo(repo, function(err, info) {
      //console.log(info);
    });
    return repo;
  }));
};

GH.userRepos = function(done) {
  var user = github.getUser();
  user.userRepos(username)
    .done(function(repos) {
      done(null, repos);
    })
    .fail(function(err) {
      done(err);
    });
};

GH.repoInfo = function(reponame, done) {
  reponame = reponame.split('/');
  var repo = github.getRepo(reponame[0], reponame[1]);
  repo.show()
    .done(function(repo) {
      done(null, repo);
    })
    .fail(function(err) {
      done(err);
    });
};