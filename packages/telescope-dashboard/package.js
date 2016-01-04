Package.describe({
  name: "telescope:dashboard",
  summary: "Telescope events package",
  version: "0.25.2",
  git: "https://github.com/TelescopeJS/telescope-calendar.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.25.2',
    'telescope:i18n@0.25.2',
    'telescope:settings@0.25.2',
    'telescope:users@0.25.2',
    'telescope:comments@0.25.2'
  ]);

  api.addFiles([
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/dashboard_main.html',
    'lib/client/templates/dashboard_sidemenu.html',
    'lib/client/templates/dashboard_progress.html',
    'lib/client/templates/dashboard_progress.js',

    // screen
    'lib/client/scss/screen.scss',
    'lib/client/scss/bootstrap/_jumbotron.scss',
    'lib/client/scss/bootstrap/_mixins.scss',
    'lib/client/scss/bootstrap/_navbar.scss',
    'lib/client/scss/bootstrap/_forms.scss',
    'lib/client/scss/bootstrap/_list-group.scss',
    'lib/client/scss/bootstrap/mixins/_grid.scss',
    'lib/client/scss/bootstrap/mixins/_grid-framework.scss',
    'lib/client/scss/bootstrap/mixins/_clearfix.scss',
    'lib/client/scss/bootstrap/mixins/_nav-vertical-align.scss',
    'lib/client/scss/bootstrap/mixins/_vendor-prefixes.scss',
    'lib/client/scss/bootstrap/mixins/_tab-focus.scss',
    'lib/client/scss/bootstrap/mixins/_forms.scss',
    'lib/client/scss/bootstrap/mixins/_border-radius.scss',
    'lib/client/scss/bootstrap/mixins/_list-group.scss',
    'lib/client/scss/bootstrap/_variables.scss',
    'lib/client/scss/bootstrap/_grid.scss',
    'lib/client/scss/modules/_dashboard.scss',
    'lib/client/scss/modules/_keendashboard.scss',
    'lib/client/scss/modules/_sidebar.scss',
    'lib/client/scss/modules/_progress.scss',
    'lib/client/javascripts/bootstrap.min.js',
    'lib/client/javascripts/radial-progress.js'


  ], ['client']);

  api.addFiles([
    'lib/server/publications.js',
  ], ['server']);

  var languages = ["en"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

  api.export('Dashboard');

});
