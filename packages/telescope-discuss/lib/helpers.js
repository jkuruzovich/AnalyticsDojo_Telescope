//////////////////
// Link Helpers //
//////////////////

/**
 * Return a calendar's link if it has one, else return its calendar page URL
 * @param {Object} calendar
 */
Calendars.getLink = function (calendar, isAbsolute) {
  return !!calendar.url ? Telescope.utils.getOutgoingUrl(calendar.url) : this.getPageUrl(calendar, isAbsolute);
};
Calendars.helpers({getLink: function (isAbsolute) {return Calendars.getLink(this, isAbsolute);}});

/**
 * Depending on the settings, return either a calendar's URL link (if it has one) or its page URL.
 * @param {Object} calendar
 */
Calendars.getShareableLink = function (calendar) {
  return Settings.get("outsideLinksPointTo", "link") === "link" ? Calendars.getLink(calendar) : Calendars.getPageUrl(calendar, true);
};
Calendars.helpers({getShareableLink: function () {return Calendars.getShareableLink(this);}});

/**
 * Whether a calendar's link should open in a new tab or not
 * @param {Object} calendar
 */
Calendars.getLinkTarget = function (calendar) {
  return !!calendar.url ? "_blank" : "";
};
Calendars.helpers({getLinkTarget: function () {return Calendars.getLinkTarget(this);}});

/**
 * Get URL of a calendar page.
 * @param {Object} calendar
 */
Calendars.getPageUrl = function(calendar, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + FlowRouter.path("calendarPage", calendar);
};
Calendars.helpers({getPageUrl: function (isAbsolute) {return Calendars.getPageUrl(this, isAbsolute);}});

/**
 * Get calendar edit page URL.
 * @param {String} id
 */
Calendars.getEditUrl = function(calendar, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + FlowRouter.path("calendarEdit", calendar);
};
Calendars.helpers({getEditUrl: function (isAbsolute) {return Calendars.getEditUrl(this, isAbsolute);}});

///////////////////
// Other Helpers //
///////////////////

/**
 * Get a calendar author's name
 * @param {Object} calendar
 */
Calendars.getAuthorName = function (calendar) {
  var user = Meteor.users.findOne(calendar.userId);
  if (user) {
    return user.getDisplayName();
  } else {
    return calendar.author;
  }
};
Calendars.helpers({getAuthorName: function () {return Calendars.getAuthorName(this);}});

/**
 * Get default status for new calendars.
 * @param {Object} user
 */
Calendars.getDefaultStatus = function (user) {
  var hasAdminRights = typeof user === 'undefined' ? false : Users.is.admin(user);
  if (hasAdminRights || !Settings.get('requireCalendarsApproval', false)) {
    // if user is admin, or else calendar approval is not required
    return Calendars.config.STATUS_APPROVED
  } else {
    // else
    return Calendars.config.STATUS_PENDING
  }
};

/**
 * Check if a calendar is approved
 * @param {Object} calendar
 */
Calendars.isApproved = function (calendar) {
  return calendar.status === Calendars.config.STATUS_APPROVED;
};
Calendars.helpers({isApproved: function () {return Calendars.isApproved(this);}});

/**
 * Check to see if calendar URL is unique.
 * We need the current user so we know who to upvote the existing calendar as.
 * @param {String} url
 */
Calendars.checkForSameUrl = function (url) {

  // check that there are no previous calendars with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var calendarWithSameLink = Calendars.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

  if (typeof calendarWithSameLink !== 'undefined') {
    throw new Meteor.Error('603', i18n.t('this_link_has_already_been_calendared'), calendarWithSameLink._id);
  }
};

/**
 * When on a calendar page, return the current calendar
 */
Calendars.current = function () {
  return Calendars.findOne(FlowRouter.getParam("_id"));
};

/**
 * Check to see if a calendar is a link to a video
 * @param {Object} calendar
 */
Calendars.isVideo = function (calendar) {
  return calendar.media && calendar.media.type === "video";
};
Calendars.helpers({isVideo: function () {return Calendars.isVideo(this);}});
