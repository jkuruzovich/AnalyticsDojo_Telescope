Template.calendar_submit.onCreated(function () {
  Telescope.subsManager.subscribe('allUsersAdmin');
});

Template.calendar_submit.helpers({
  calendarFields: function () {
    return Calendars.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  submitCalendarForm: {

    before: {
      method: function(doc) {

        var calendar = doc;

        this.template.$('button[type=submit]').addClass('loading');
        this.template.$('input, textarea').not(":disabled").addClass("disabled").prop("disabled", true);

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), 'error');
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all calendar submit client callbacks on properties object successively
        calendar = Telescope.callbacks.run("calendarSubmitClient", calendar);

        return calendar;
      }
    },

    onSuccess: function(operation, calendar) {
      Events.track("new calendar", {'calendarId': calendar._id});
      var template = this.template;
      Telescope.subsManager.subscribe('singleCalendar', calendar._id, function () {
        template.$('button[type=submit]').removeClass('loading');
        FlowRouter.go('calendarPage', calendar);
      });
    },

    onError: function(operation, error) {
      this.template.$('button[type=submit]').removeClass('loading');
      this.template.$('.disabled').removeClass("disabled").prop("disabled", false);

      Messages.flash(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      Messages.clearSeen();
      // $(e.target).removeClass('disabled');
      if (error.error === "603") {
        var dupeCalendarId = error.reason.split('|')[1];
        FlowRouter.go('calendarPage', {slug: '_', _id: dupeCalendarId});
      }
    }

  }
});
