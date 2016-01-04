Telescope.modules.add("calendarsListTop", {
  template: "views_menu_calendar",
  order: 1
});

Telescope.modules.add("calendarComponents", [
  {
    template: 'calendar_rank',
    order: 1
  },
  {
    template: 'calendar_vote',
    order: 10
  },
  {
    template: 'calendar_content',
    order: 20
  },
  {
    template: 'calendar_avatars',
    order: 30
  },
  {
    template: 'calendar_discuss',
    order: 40
  },
  {
    template: 'calendar_actions',
    order: 50
  }
]);

Telescope.modules.add("calendarHeading", [
  {
    template: 'calendar_title',
    order: 10
  },
  {
    template: 'calendar_domain',
    order: 20
  }
]);

Telescope.modules.add("calendarMeta", [
  {
    template: 'calendar_author',
    order: 10
  },
  {
    template: 'calendar_info',
    order: 20
  },
  {
    template: 'calendar_comments_link',
    order: 30
  },
  {
    template: 'calendar_admin',
    order: 50
  }
]);
