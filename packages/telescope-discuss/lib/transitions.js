// Calendars.addStateTransition("status", [
//   {
//     name: "approve",
//     from: "*",
//     to: Calendars.config.STATUS_APPROVED,
//     callback: function (oldCalendar, newCalendar) {
//       Telescope.callbacks.runAsync("calendarApproveAsync", newCalendar, oldCalendar);
//     }
//   },
//   {
//     name: "unapprove",
//     from: Calendars.config.STATUS_APPROVED,
//     to: "*",
//     callback: function (oldCalendar, newCalendar) {
//       Telescope.callbacks.runAsync("calendarUnapproveAsync", newCalendar, oldCalendar);
//     }
//   },
//   {
//     name: "makePending",
//     from: "*",
//     to: Calendars.config.STATUS_PENDING,
//     callback: function (oldCalendar, newCalendar) {
//       Telescope.callbacks.runAsync("calendarMakePendingAsync", newCalendar, oldCalendar);
//     }
//   },
//   {
//     name: "reject",
//     from: "*",
//     to: Calendars.config.STATUS_REJECTED,
//     callback: function (oldCalendar, newCalendar) {
//       Telescope.callbacks.runAsync("calendarRejectAsync", newCalendar, oldCalendar);
//     }
//   }
// ]);