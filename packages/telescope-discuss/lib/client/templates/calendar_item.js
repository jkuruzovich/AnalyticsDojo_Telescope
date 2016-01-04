Template.calendar_item.helpers({
  calendarClass: function () {
    var calendar = this;
    var calendarClass = "calendar ";
    
    calendarClass += "author-"+Telescope.utils.slugify(calendar.author)+" ";

    if (this.sticky) {
      calendarClass += "sticky ";
    }
    calendarClass = Telescope.callbacks.run("calendarClass", calendarClass, calendar);
    return calendarClass;
  }
});
