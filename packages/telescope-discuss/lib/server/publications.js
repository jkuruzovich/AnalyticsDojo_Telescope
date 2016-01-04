Calendars._ensureIndex({"status": 1, "postedAt": 1});

// Publish a list of calendars

// on the server
Meteor.publish('calendars', function() {
    return Calendars.find({ });
});

Meteor.publish('calendarsList', function(terms) {

  terms.userId = this.userId; // add userId to terms
  
  if(Users.can.viewById(this.userId)){
    var parameters = Calendars.parameters.get(terms),
        calendars = Calendars.find(parameters.find, parameters.options);

    return calendars;
  }
  return [];
});

// Publish all the users that have calendared the currently displayed list of calendars
// plus the commenters for each calendar

Meteor.publish('calendarsListUsers', function(terms) {
  
  terms.userId = this.userId; // add userId to terms
  
  if(Users.can.viewById(this.userId)){
    var parameters = Calendars.parameters.get(terms),
        calendars = Calendars.find(parameters.find, parameters.options),
        userIds = _.pluck(calendars.fetch(), 'userId');

    // for each calendar, add first four commenter's userIds to userIds array
    calendars.forEach(function (calendar) {
      userIds = userIds.concat(_.first(calendar.commenters,4));
    });

    userIds = _.unique(userIds);

    return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.avatarProperties, multi: true});
  }
  return [];
});

// Publish a single calendar

Meteor.publish('singleCalendar', function(calendarId) {

  check(calendarId, String);

  if (Users.can.viewById(this.userId)){
    return Calendars.find(calendarId);
  }
  return [];
});

// Publish author of the current calendar, authors of its comments, and upvoters of the calendar

Meteor.publish('calendarUsers', function(calendarId) {

  check(calendarId, String);

  if (Users.can.viewById(this.userId)){
    // publish calendar author and calendar commenters
    var calendar = Calendars.findOne(calendarId);
    var users = [];

    if (calendar) {

      users.push(calendar.userId); // publish calendar author's ID

      // get IDs from all commenters on the calendar
      var comments = Comments.find({calendarId: calendar._id}).fetch();
      if (comments.length) {
        users = users.concat(_.pluck(comments, "userId"));
      }

      // publish upvoters
      if (calendar.upvoters && calendar.upvoters.length) {
        users = users.concat(calendar.upvoters);
      }

      // publish downvoters
      if (calendar.downvoters && calendar.downvoters.length) {
        users = users.concat(calendar.downvoters);
      }

    }

    // remove any duplicate IDs
    users = _.unique(users);

    return Meteor.users.find({_id: {$in: users}}, {fields: Users.pubsub.publicProperties});
  }
  return [];
});
