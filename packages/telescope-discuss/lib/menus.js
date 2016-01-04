Calendars.getRoute = function () {
  FlowRouter.watchPathChange()
  var viewName = this.name;
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var newQuery = _.extend(currentQuery, {view: viewName});
  return FlowRouter.path("calendarsDefault", FlowRouter.current().params, newQuery);
};

// array containing items in the views menu
var viewsMenuItems = [
  {
    route: Calendars.getRoute,
    name: 'top',
    description: 'most_popular_calendars'
  },
  {
    route: Calendars.getRoute,
    name: 'new',
    description: 'newest_calendars'
  },
  {
    route: Calendars.getRoute,
    name: 'best',
    description: 'highest_ranked_calendars_ever'
  },
  {
    route: Calendars.getRoute,
    name: 'pending',
    description: 'calendars_awaiting_moderation',
    adminOnly: true
  },
  {
    route: Calendars.getRoute,
    name: 'rejected',
    description: 'rejected_calendars',
    adminOnly: true
  },
  {
    route: Calendars.getRoute,
    name: 'scheduled',
    description: 'future_scheduled_calendars',
    adminOnly: true
  },
];

// add label & description i18n functions
viewsMenuItems = viewsMenuItems.map(function (item) {
  item.label = _.partial(i18n.t, item.name);
  item.description = _.partial(i18n.t, item.description);
  return item;
});

Telescope.menuItems.add("viewsMenu", viewsMenuItems);