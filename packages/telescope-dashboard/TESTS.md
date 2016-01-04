
### Client-Side Operations

#### Insert

- `Calendars.insert()` should always fail (no `allow/deny` validators are set on `Calendars` collection for `insert` operation).

#### Update on allowed property

`Calendars.update(calendarId, {$set: {title: "Hello World"}})` should return 1 only if current user is admin, or current user owns the calendar.

#### Update on admin-only property

`Calendars.update(calendarId, {$set: {status: 1}})` should return 1 only if current user is admin.

#### Update on disallowed property

`Calendars.update(calendarId, {$set: {baseScore: 999}})` should always throw an error.



### Meteor Method Calls

#### submitCalendar

#### editCalendar



### Server-Side Calls

#### Calendars.submit()

`Calendars.submit(calendar)` should insert a calendar in the database.