
//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * Generate HTML body from Markdown on calendar insert
 */
Calendars.before.insert(function (userId, doc) {
  if(!!doc.body)
    doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));
});

/**
 * Generate HTML body from Markdown when calendar body is updated
 */
Calendars.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified or $unset, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
  if (Meteor.isServer && modifier.$unset && (typeof modifier.$unset.body !== "undefined")) {
    modifier.$unset.htmlBody = "";
  }
});

/**
 * Generate slug when calendar title is updated
 */
Calendars.before.update(function (userId, doc, fieldNames, modifier) {
  // if title is being modified, update slug too
  if (Meteor.isServer && modifier.$set && modifier.$set.title) {
    modifier.$set.slug = Telescope.utils.slugify(modifier.$set.title);
  }
});

/**
 * Disallow $rename
 */
Calendars.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

/**
 * Increment the user's calendar count and upvote the calendar
 */
function afterCalendarSubmitOperations (calendar) {
  var userId = calendar.userId;
  Meteor.users.update({_id: userId}, {$inc: {"telescope.calendarCount": 1}});
  return calendar;
}
Telescope.callbacks.add("calendarSubmitAsync", afterCalendarSubmitOperations);

function upvoteOwnCalendar (calendar) {
  var calendarAuthor = Meteor.users.findOne(calendar.userId);
  Telescope.upvoteItem(Calendars, calendar._id, calendarAuthor);
  return calendar;
}
Telescope.callbacks.add("calendarSubmitAsync", upvoteOwnCalendar);

function setPostedAt (calendar) {
  if (calendar.isApproved() && !calendar.postedAt) {
    Calendars.update(calendar._id, {$set: {postedAt: new Date()}});
  }
}
Telescope.callbacks.add("calendarEditAsync", setPostedAt);