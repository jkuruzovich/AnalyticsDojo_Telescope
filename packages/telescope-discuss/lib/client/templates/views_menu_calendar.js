var getMenuItems = function () {
  var defaultItems = Telescope.menuItems.get("viewsMenuCalendar");

  // reject an item if the item is admin only and the current user is not an admin
  // or if views have been configured in the settings and the item is not part of them
  var viewableItems = _.reject(defaultItems, function (item) {
    return (item.adminOnly && !Users.is.admin(Meteor.user())) || (!!Settings.get('calendarViews') && !_.contains(Settings.get('calendarViews'), item.name));
  });

  viewableItems = _.map(viewableItems, function (item) {
    item.itemClass = "view-"+item.name;
    return item;
  });

  return viewableItems; 
};

Template.views_menu_calendar.helpers({
  menuLabel: function () {
    return i18n.t("view");
  },
  menuItems: function () {
    return getMenuItems();
  }
});
