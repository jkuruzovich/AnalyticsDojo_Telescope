FlowRouter.route('/discuss', {
  name: "calendarsDefault",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "main_calendars_list"});
  }
});

FlowRouter.route('/discuss/:_id/edit', {
  name: "calendarEdit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "calendar_edit"});
  }
});

FlowRouter.route('/discuss/:_id/:slug?', {
  name: "calendarPage",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "calendar_page"});
  }
});

var trackRouteEntry = function (context) {
  var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
  Meteor.call('increaseCalendarViews', context.params._id, sessionId);
}

FlowRouter.route('/discusssubmit', {
  name: "calendarSubmit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "calendar_submit"});
  }
});