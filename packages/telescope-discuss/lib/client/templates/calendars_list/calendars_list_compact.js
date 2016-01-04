Template.calendars_list_compact.helpers({
  calendarsCursor: function () {
    if (this.calendarsCursor) { // not sure why this should ever be undefined, but it can apparently
      var calendars = this.calendarsCursor.map(function (calendar, index) {
        calendar.rank = index;
        return calendar;
      });
      return calendars;
    } else {
      console.log('calendarsCursor not defined');
    }
  },
  fieldLabel: function () {
    return this.controllerOptions.fieldLabel;
  },
  fieldValue: function () {
    var controllerOptions = Template.parentData(3).data.controllerOptions;
    return controllerOptions.fieldValue(this);
  }
});

Template.calendars_list_compact.events({
  'click .more-button': function (event) {
    event.preventDefault();
    if (this.controllerInstance) {
      // controller is a template
      this.loadMoreHandler(this.controllerInstance);
    } else {
      // controller is router
      this.loadMoreHandler();
    }
  }
});
