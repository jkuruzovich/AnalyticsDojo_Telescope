// ----------------------------------- Calendar List -----------------------------------//

Template.calendars_list.created = function() {
  Session.set('listPopulatedAt', new Date());
};

Template.calendars_list.helpers({
  calendarsLayout: function () {
    return Settings.get('calendarsLayout', 'calendars-list');
  },
  description: function () {
    var controller = Iron.controller();
    if (typeof controller.getDescription === 'function')
      return Iron.controller().getDescription();
  },
  calendarsCursor : function () {
    if (this.calendarsCursor) { // not sure why this should ever be undefined, but it can apparently
      var calendars = this.calendarsCursor.map(function (calendar, index) {
        calendar.rank = index;
        return calendar;
      });
      return calendars;
    } else {
      console.log('calendarsCursor not defined');
    }
  }
});

// ----------------------------------- Incoming -----------------------------------//

Template.calendarsListIncoming.events({
  'click .show-new': function() {
    Session.set('listPopulatedAt', new Date());
  }
});

// ----------------------------------- Load More -----------------------------------//

Template.calendarsLoadMore.helpers({
  calendarsReady: function () {
    return this.calendarsReady;
  },
  showInfiniteScroll: function () {
    if (this.controllerOptions && this.controllerOptions.loadMoreBehavior === "button") {
      return false;
    } else {
      return this.hasMoreCalendars;
    }
  },
  showLoadMoreButton: function () {
    if (this.controllerOptions && this.controllerOptions.loadMoreBehavior === "scroll") {
      return false;
    } else {
      return this.hasMoreCalendars;
    }
  },
  hasCalendars: function () {
    return !!this.calendarsCursor.count();
  }
});

Template.calendarsLoadMore.onCreated(function () {

  var context = Template.currentData();

  if (context.controllerOptions && context.controllerOptions.loadMoreBehavior === "scroll") {

    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() === $(document).height()) {
        context.loadMoreHandler(context.controllerInstance);
      }
    });

  }
});

Template.calendarsLoadMore.events({
  'click .more-button': function (event) {
    event.preventDefault();
    this.loadMoreHandler(this.controllerInstance);
  }
});
