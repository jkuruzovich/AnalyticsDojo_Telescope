var doSEOStuff = function (calendar) {

  var link = {rel: "canonical", href: "calendar.getPageUrl(true)"};
  DocHead.addLink(link);
  
  // Set SEO properties
  
  var seoProperties = {meta: {}};

  // Set site name
  DocHead.addMeta({property: "og:site_name", content: Settings.get("title")});

  // Set title
  Telescope.SEO.setTitle(calendar.title);

  // Set description
  if (!!calendar.body) {
    var description = Telescope.utils.trimWords(calendar.body, 100);
    Telescope.SEO.setDescription(description);
  }

  // Set image
  if (!!calendar.thumbnailUrl) {
    var image = Telescope.utils.addHttp(calendar.thumbnailUrl);
    DocHead.addMeta({property: "twitter:card", content: "summary_large_image"});
    Telescope.SEO.setImage(image);
  }

  // Set Twitter username
  if (!!Settings.get("twitterAccount")) {
    DocHead.addMeta({property: "twitter:site", content: Settings.get("twitterAccount")});
  }
  
};

Template.calendar_page.onCreated(function () {

  var template = this;
  var calendarId = FlowRouter.getParam("_id");

  // initialize the reactive variables
  template.ready = new ReactiveVar(false);

  var calendarSubscription = Telescope.subsManager.subscribe('singleCalendar', calendarId);
  var calendarUsersSubscription = Telescope.subsManager.subscribe('calendarUsers', calendarId);
  var commentSubscription = Telescope.subsManager.subscribe('commentsList', {view: 'calendarComments', calendarId: calendarId});
  
  // Autorun 3: when subscription is ready, update the data helper's terms
  template.autorun(function () {

    var subscriptionsReady = calendarSubscription.ready(); // ⚡ reactive ⚡

    // if subscriptions are ready, set terms to subscriptionsTerms and update SEO stuff
    if (subscriptionsReady) {
      template.ready.set(true);
      var calendar = Calendars.findOne(FlowRouter.getParam("_id"));
      if (calendar) {
        doSEOStuff(calendar);
      }
    }
  });

});

Template.calendar_page.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  calendar: function () {
    return Calendars.findOne(FlowRouter.getParam("_id"));
  },
  canView: function () {
    var calendar = this;
    var user = Meteor.user();
    if (calendar.status === Calendars.config.STATUS_PENDING && !Users.can.viewPendingCalendar(user, calendar)) {
      return false;
    } else if (calendar.status === Calendars.config.STATUS_REJECTED && !Users.can.viewRejectedCalendar(user, calendar)) {
      return false;
    }
    return true;
  },
  isPending: function () {
    return this.status === Calendars.config.STATUS_PENDING;
  }
});

Template.calendar_page.rendered = function(){
  $('body').scrollTop(0);
};
