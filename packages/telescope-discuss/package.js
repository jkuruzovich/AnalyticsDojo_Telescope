Package.describe({
  name: "telescope:discuss",
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
    'lib/namespace.js',
    'lib/config.js',
    'lib/calendars.js',
    'lib/parameters.js',
    'lib/views.js',
    'lib/helpers.js',
    'lib/modules.js',
    'lib/callbacks.js',
    'lib/methods.js',
    'lib/transitions.js',
    'lib/menus.js',
    'lib/routes.js',
    'lib/hubble.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/after_calendar_item.html',
    'lib/client/templates/before_calendar_item.html',
    'lib/client/templates/modules/calendar_actions.html',
    'lib/client/templates/modules/calendar_actions.js',
    'lib/client/templates/modules/calendar_admin.html',
    'lib/client/templates/modules/calendar_admin.js',
    'lib/client/templates/modules/calendar_author.html',
    'lib/client/templates/modules/calendar_author.js',
    'lib/client/templates/modules/calendar_avatars.html',
    'lib/client/templates/modules/calendar_avatars.js',
    'lib/client/templates/modules/calendar_comments_link.html',
    'lib/client/templates/modules/calendar_content.html',
    'lib/client/templates/modules/calendar_content.js',
    'lib/client/templates/modules/calendar_discuss.html',
    'lib/client/templates/modules/calendar_domain.html',
    'lib/client/templates/modules/calendar_domain.js',
    'lib/client/templates/modules/calendar_info.html',
    'lib/client/templates/modules/calendar_info.js',
    'lib/client/templates/modules/calendar_rank.html',
    'lib/client/templates/modules/calendar_rank.js',
    'lib/client/templates/modules/calendar_title.html',
    'lib/client/templates/modules/calendar_vote.html',
    'lib/client/templates/modules/calendar_vote.js',
    'lib/client/templates/calendar_body.html',
    'lib/client/templates/calendar_edit.html',
    'lib/client/templates/calendar_edit.js',
    'lib/client/templates/calendar_item.html',
    'lib/client/templates/calendar_item.js',
    'lib/client/templates/calendar_page.html',
    'lib/client/templates/calendar_page.js',
    'lib/client/templates/calendar_submit.html',
    'lib/client/templates/calendar_submit.js',
    'lib/client/templates/views_menu_calendar.html',
    'lib/client/templates/views_menu_calendar.js',
    'lib/client/templates/main_calendars_list.html',
    'lib/client/templates/main_calendars_list.js',
    'lib/client/templates/calendars_list/calendars_list.html',
    'lib/client/templates/calendars_list/calendars_list.js',
    'lib/client/templates/calendars_list/calendars_list_compact.html',
    'lib/client/templates/calendars_list/calendars_list_compact.js',
    'lib/client/templates/calendars_list/calendars_list_controller.html',
    'lib/client/templates/calendars_list/calendars_list_controller.js',
          'lib/client/scss/modules/_accounts.scss',
          'lib/client/scss/modules/_comments.scss',
          'lib/client/scss/modules/_dialogs.scss',
          'lib/client/scss/modules/_nav.scss',
          'lib/client/scss/modules/_posts.scss',
          'lib/client/scss/modules/_user-profile.scss',
          'lib/client/scss/modules/_banners.scss',

          // partials
          'lib/client/scss/partials/_colors.scss',
          'lib/client/scss/partials/_grid.scss',
          'lib/client/scss/partials/_mixins.scss',
          'lib/client/scss/partials/_tooltips.scss',
          'lib/client/scss/partials/_typography.scss',

          // screen
          'lib/client/scss/screen.scss'


  ], ['client']);

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/fastrender.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

  api.export('Calendars');

});
