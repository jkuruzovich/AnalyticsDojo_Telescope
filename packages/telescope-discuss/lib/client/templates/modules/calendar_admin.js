Template.calendar_admin.helpers({
  showApprove: function () {
    return !!Settings.get('requireCalendarsApproval') && (this.status === Calendars.config.STATUS_PENDING || this.status === Calendars.config.STATUS_REJECTED);
  },
  showReject: function(){
    return !!Settings.get('requireCalendarsApproval') && (this.status === Calendars.config.STATUS_PENDING || this.status === Calendars.config.STATUS_APPROVED);
  },
  shortScore: function(){
    return Math.floor(this.score*100)/100;
  }
});

Template.calendar_admin.events({
  'click .approve-link': function(e){
    Meteor.call('approveCalendar', this._id);
    e.preventDefault();
  },
  'click .reject-link': function(e){
    Meteor.call('rejectCalendar', this._id);
    e.preventDefault();
  },
  'click .delete-link': function(e){
    var calendar = this;

    e.preventDefault();

    if(confirm("Delete “"+calendar.title+"”?")){
      FlowRouter.go('calendarsDefault');
      Meteor.call("deleteCalendarById", calendar._id, function(error) {
        if (error) {
          console.log(error);
          Messages.flash(error.reason, 'error');
        } else {
          Messages.flash(i18n.t('your_calendar_has_been_deleted'), 'success');
        }
      });
    }
  }
});