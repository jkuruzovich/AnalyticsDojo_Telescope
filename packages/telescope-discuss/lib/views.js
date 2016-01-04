/**
 * Calendar views are filters used for subscribing to and viewing Calendars
 * @namespace Calendars.views
 */
Calendars.views = {};

/**
 * Add a Calendar view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Calendars.views.add = function (viewName, viewFunction) {
  Calendars.views[viewName] = viewFunction;
};

/**
 * Base parameters that will be common to all other view unless specific properties are overwritten
 */
Calendars.views.baseParameters = {
  find: {
    status: Calendars.config.STATUS_APPROVED
  },
  options: {
    limit: 10
  }
};

/**
 * Top view
 */
Calendars.views.add("top", function (terms) {
  return {
    options: {sort: {sticky: -1, score: -1}}
  };
});

/**
 * New view
 */
Calendars.views.add("new", function (terms) {
  return {
    options: {sort: {sticky: -1, PostedAt: -1}}
  };
});

/**
 * Best view
 */
Calendars.views.add("best", function (terms) {
  return {
    options: {sort: {sticky: -1, baseScore: -1}}
  };
});

/**
 * Pending view
 */
Calendars.views.add("pending", function (terms) {
  return {
    find: {
      status: Calendars.config.STATUS_PENDING
    },
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
});

/**
 * Rejected view
 */
Calendars.views.add("rejected", function (terms) {
  return {
    find: {
      status: Calendars.config.STATUS_REJECTED
    },
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
});

/**
 * Scheduled view
 */
Calendars.views.add("scheduled", function (terms) {
  return {
    find: {PostedAt: {$gte: new Date()}},
    options: {sort: {PostedAt: -1}},
    showFuture: true
  };
});

/**
 * User Calendars view
 */
Calendars.views.add("userCalendars", function (terms) {
  return {
    find: {userId: terms.userId},
    options: {limit: 5, sort: {PostedAt: -1}}
  };
});

/**
 * User upvoted Calendars view
 */
Calendars.views.add("userUpvotedCalendars", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var CalendarsIds = _.pluck(user.telescope.upvotedCalendars, "itemId");
  return {
    find: {_id: {$in: CalendarsIds}, userId: {$ne: terms.userId}}, // exclude own Calendars
    options: {limit: 5, sort: {PostedAt: -1}}
  };
});

/**
 * User downvoted Calendars view
 */
Calendars.views.add("userDownvotedCalendars", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var CalendarsIds = _.pluck(user.telescope.downvotedCalendars, "itemId");
  // TODO: sort based on votedAt timestamp and not PostedAt, if possible
  return {
    find: {_id: {$in: CalendarsIds}},
    options: {limit: 5, sort: {PostedAt: -1}}
  };
});
