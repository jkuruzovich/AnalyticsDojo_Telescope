/**
 *
 * Calendar Methods
 *
 */

/**
 * Insert a calendar in the database (note: optional calendar properties not listed here)
 * @param {Object} calendar - the calendar being inserted
 * @param {string} calendar.userId - the id of the user the calendar belongs to
 * @param {string} calendar.title - the calendar's title
 */
Calendars.submit = function (calendar) {

  var userId = calendar.userId, // at this stage, a userId is expected
      user = Users.findOne(userId);

  // ------------------------------ Checks ------------------------------ //

  // check that a title was provided
  if(!calendar.title)
    throw new Meteor.Error(602, i18n.t('please_fill_in_a_title'));

  // check that there are no calendars with the same URL
  if(!!calendar.url)
    Calendars.checkForSameUrl(calendar.url, user);

  // ------------------------------ Properties ------------------------------ //

  var defaultProperties = {
    createdAt: new Date(),
    author: Users.getDisplayNameById(userId),
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    clickCount: 0,
    viewCount: 0,
    baseScore: 0,
    score: 0,
    inactive: false,
    sticky: false,
    status: Calendars.getDefaultStatus()
  };

  calendar = _.extend(defaultProperties, calendar);

  // if calendar is approved but doesn't have a postedAt date, give it a default date
  // note: pending calendars get their postedAt date only once theyre approved
  if (calendar.status === Calendars.config.STATUS_APPROVED && !calendar.postedAt)
    calendar.postedAt = new Date();

  // clean up calendar title
  calendar.title = Telescope.utils.cleanUp(calendar.title);

  // generate slug
  calendar.slug = Telescope.utils.slugify(calendar.title);

  // ------------------------------ Callbacks ------------------------------ //

  // run all calendar submit server callbacks on calendar object successively
  calendar = Telescope.callbacks.run("calendarSubmit", calendar);

  // -------------------------------- Insert ------------------------------- //

  calendar._id = Calendars.insert(calendar);

  // --------------------- Server-Side Async Callbacks --------------------- //

  // note: query for calendar to get fresh document with collection-hooks effects applied
  Telescope.callbacks.runAsync("calendarSubmitAsync", Calendars.findOne(calendar._id));

  return calendar;
};

/**
 * Edit a calendar in the database
 * @param {string} calendarId – the ID of the calendar being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} calendar - the current calendar object
 */
Calendars.edit = function (calendarId, modifier, calendar) {

  if (typeof calendar === "undefined") {
    calendar = Calendars.findOne(calendarId);
  }

  // ------------------------------ Callbacks ------------------------------ //

  modifier = Telescope.callbacks.run("calendarEdit", modifier, calendar);

  // ------------------------------ Update ------------------------------ //

  Calendars.update(calendarId, modifier);

  // ------------------------------ Callbacks ------------------------------ //

  Telescope.callbacks.runAsync("calendarEditAsync", Calendars.findOne(calendarId), calendar);

  // ------------------------------ After Update ------------------------------ //
  return Calendars.findOne(calendarId);
};

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

var calendarViews = [];

Meteor.methods({

  /**
   * Meteor method for submitting a calendar from the client
   * @memberof Calendars
   * @param {Object} calendar - the calendar being inserted
   */
  submitCalendar: function(calendar){

    check(calendar, Calendars.simpleSchema());

    // required properties:
    // title

    // optional properties
    // URL
    // body
    // categories
    // thumbnailUrl

    // NOTE: the current user and the calendar author user might be two different users!
    var user = Meteor.user(),
        hasAdminRights = Users.is.admin(user),
        schema = Calendars.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can calendar  [JNK need to add can calendar to users. ]
    if (!user || !Users.can.post(user))
      throw new Meteor.Error(601, i18n.t('you_need_to_login_or_be_invited_to_calendar_new_stories'));

    // --------------------------- Rate Limiting -------------------------- //

    if(!hasAdminRights){

      var timeSinceLastCalendar = Users.timeSinceLast(user, Calendars),
        numberOfCalendarsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Calendars),
        calendarInterval = Math.abs(parseInt(Settings.get('calendarInterval', 30))),
        maxCalendarsPer24Hours = Math.abs(parseInt(Settings.get('maxCalendarsPerDay', 30)));

      // check that user waits more than X seconds between calendars
      if(timeSinceLastCalendar < calendarInterval)
        throw new Meteor.Error(604, i18n.t('please_wait')+(calendarInterval-timeSinceLastCalendar)+i18n.t('seconds_before_calendaring_again'));

      // check that the user doesn't calendar more than Y calendars per day
      if(numberOfCalendarsInPast24Hours > maxCalendarsPer24Hours)
        throw new Meteor.Error(605, i18n.t('sorry_you_cannot_submit_more_than')+maxCalendarsPer24Hours+i18n.t('calendars_per_day'));

    }

    // ------------------------------ Properties ------------------------------ //

    // admin-only properties
    // status
    // postedAt
    // userId
    // sticky (default to false)

    // go over each schema field and throw an error if it's not editable
    _.keys(calendar).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.can.submitField(user, field)) {
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
      }

    });

    // if no calendar status has been set, set it now
    if (!calendar.status) {
      calendar.status = Calendars.getDefaultStatus(user);
    }

    // if no userId has been set, default to current user id
    if (!calendar.userId) {
      calendar.userId = user._id;
    }

    return Calendars.submit(calendar);
  },

  /**
   * Meteor method for editing a calendar from the client
   * @memberof Calendars
   * @param {Object} modifier - the update modifier
   * @param {Object} calendarId - the id of the calendar being updated
   */
  editCalendar: function (modifier, calendarId) {

    // checking might be redundant because SimpleSchema already enforces the schema, but you never know
    check(modifier, Match.OneOf({$set: Calendars.simpleSchema()}, {$unset: Object}, {$set: Calendars.simpleSchema(), $unset: Object}));
    check(calendarId, String);

    var user = Meteor.user(),
        calendar = Calendars.findOne(calendarId),
        schema = Calendars.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!user || !Users.can.edit(user, calendar)) {
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_calendar'));
    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {

        var field = schema[fieldName];
        if (!Users.can.editField(user, field, calendar)) {
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    return Calendars.edit(calendarId, modifier, calendar);

  },
//Changed JNK
setCalendarAt: function(calendar, customPostedAt){

    // this method is not actually used?

    check(calendar, Calendars.simpleSchema());
    check(customPostedAt, Date);
    var postedAt = new Date(); // default to current date and time

    if(Users.is.admin(Meteor.user()) && typeof customPostedAt !== 'undefined') // if user is admin and a custom datetime has been set
      postedAt = customPostedAt;

    Calendars.update(calendar._id, {$set: {postedAt: postedAt}});
  },

  approveCalendar: function(calendarId){

    check(calendarId, String);
    
    var calendar = Calendars.findOne(calendarId);
    var now = new Date();

    if(Users.is.admin(Meteor.user())){

      var set = {status: Calendars.config.STATUS_APPROVED};

      if (!calendar.postedAt) {
        set.postedAt = now;
      }
      
      Calendars.update(calendar._id, {$set: set});

      Telescope.callbacks.runAsync("calendarApproveAsync", calendar);

    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  rejectCalendar: function(calendarId){

    check(calendarId, String);
    var calendar = Calendars.findOne(calendarId);
    
    if(Users.is.admin(Meteor.user())){

      Calendars.update(calendar._id, {$set: {status: Calendars.config.STATUS_REJECTED}});

      Telescope.callbacks.runAsync("calendarRejectAsync", calendar);
    
    }else{
      Messages.flash('You need to be an admin to do that.', "error");
    }
  },

  increaseCalendarViews: function(calendarId, sessionId){

    check(calendarId, String);
    check(sessionId, Match.Any);

    this.unblock();

    // only let users increment a calendar's view counter once per session
    var view = {_id: calendarId, userId: this.userId, sessionId: sessionId};

    if(_.where(calendarViews, view).length === 0){
      calendarViews.push(view);
      Calendars.update(calendarId, { $inc: { viewCount: 1 }});
    }
  },

  deleteCalendarById: function(calendarId) {

    check(calendarId, String);

    // remove calendar comments
    // if(!this.isSimulation) {
    //   Comments.remove({calendar: calendarId});
    // }
    // NOTE: actually, keep comments after all

    var calendar = Calendars.findOne({_id: calendarId});

    if(!Meteor.userId() || !Users.can.editById(Meteor.userId(), calendar)) throw new Meteor.Error(606, 'You need permission to edit or delete a calendar');

    // decrement calendar count
    Users.update({_id: calendar.userId}, {$inc: {"telescope.calendarCount": -1}});

    // delete calendar
    Calendars.remove(calendarId);

    Telescope.callbacks.runAsync("calendarDeleteAsync", calendar);

  },



});
