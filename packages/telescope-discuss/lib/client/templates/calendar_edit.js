Template.calendar_edit.onCreated(function () {

  var template = this;

  // initialize the reactive variables
  template.ready = new ReactiveVar(false);

  var calendarSubscription = Telescope.subsManager.subscribe('singleCalendar', FlowRouter.getParam("_id"));
  
  // Autorun 3: when subscription is ready, update the data helper's terms
  template.autorun(function () {

    var subscriptionsReady = calendarSubscription.ready(); // ⚡ reactive ⚡

    // if subscriptions are ready, set terms to subscriptionsTerms
    if (subscriptionsReady) {
      template.ready.set(true);
    }
  });

});

Template.calendar_edit.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  calendar: function () {
    return Calendars.findOne(FlowRouter.getParam("_id"));
  },
  calendarFields: function () {
    return Calendars.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  editCalendarForm: {

    before: {
      "method-update": function() {
        
        var calendar = this.currentDoc;
        var modifier = this.updateDoc;

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), "");
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        modifier = Telescope.callbacks.run("calendarEditClient", modifier, calendar);
        return modifier;
      }
    },

    onSuccess: function(formType, calendar) {
      Events.track("edit calendar", {'calendarId': calendar._id});
      FlowRouter.go('calendarPage', calendar);
    },

    onError: function(formType, error) {
      console.log(error);
      Messages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      Messages.clearSeen();
    }

  }
});