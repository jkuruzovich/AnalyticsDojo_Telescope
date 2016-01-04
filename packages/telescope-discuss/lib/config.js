/**
 * Calendars config namespace
 * @type {Object}
 */
Calendars.config = {};


/**
 * Calendar Statuses
 */
Calendars.config.calendarStatuses = [
  {
    value: 1,
    label: function(){return i18n.t('pending');}
  },
  {
    value: 2,
    label: function(){return i18n.t('approved');}
  },
  {
    value: 3,
    label: function(){return i18n.t('rejected');}
  }
];

Calendars.config.STATUS_PENDING = 1;
Calendars.config.STATUS_APPROVED = 2;
Calendars.config.STATUS_REJECTED = 3;