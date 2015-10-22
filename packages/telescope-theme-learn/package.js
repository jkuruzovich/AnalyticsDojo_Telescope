Package.describe({
    name: "telescope-theme-learn",
    summary: "Analytics Dojo",
    version: '0.2.0'
});

Package.onUse(function (api) {

    api.versionsFrom(['METEOR@1.0']);

    api.use([
        'telescope:core',
        'telescope:theme-base'
    ]);

    api.addFiles([
        'lib/server/templates/zss_emailDigest.handlebars',
        'lib/server/templates/zss_emailPostItem.handlebars'
    ], ['server']);

  api.addFiles([
        'lib/client/templates/footer_code.html',
        'lib/client/templates/post_body.html',
        'lib/client/templates/comment_item.html',
        'lib/client/templates/comment_reply.html',
        'lib/client/templates/header.html',
       'lib/client/templates/header.js',
        'i18n/en.i18n.json',
        'lib/client/stylesheets/custom.scss'
  ], ['client']);

        api.addFiles([
        'lib/custom_fields.js',
            'lib/config.js'
   ], ['client','server']);
  api.export([
    'orgName',
    'myFunction'
  ]);
});



