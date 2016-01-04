/**
 * Calendars schema
 * @type {SimpleSchema}
 */
Calendars.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true
  },
  /**
    Timetstamp of calendar creation
  */
  createdAt: {
    type: Date,
    optional: true
  },
  /**
    Timestamp of calendar first appearing on the site (i.e. being approved)
  */
  postedAt: {
    type: Date,
    optional: true,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      type: "bootstrap-datetimepicker"
    }
  },
  /**
    URL
  */
  url: {
    type: String,
    optional: true,
    max: 500,
    editableBy: ["member", "admin"],
    autoform: {
      type: "bootstrap-url"
    }
  },
  /**
    Title
  */
  title: {
    type: String,
    optional: false,
    max: 500,
    editableBy: ["member", "admin"]
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true
  },
  /**
    Calendar body (markdown)
  */
  body: {
    type: String,
    optional: true,
    max: 3000,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5
    }
  },
  /**
    HTML version of the calendar body
  */
  htmlBody: {
    type: String,
    optional: true
  },
  /**
    Count of how many times the calendar's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true
  },
  /**
    Count of the calendar's comments
  */
  commentCount: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of commenters
  */
  commenters: {
    type: [String],
    optional: true
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true
  },
  /**
    Count of how many times the calendar's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true
  },
  /**
    The calendar's base score (not factoring in the calendar's age)
  */
  baseScore: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
    How many upvotes the calendar has received
  */
  upvotes: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of the calendar's upvoters
  */
  upvoters: {
    type: [String],
    optional: true
  },
  /**
    How many downvotes the calendar has received
  */
  downvotes: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of the calendar's downvoters
  */
  downvoters: {
    type: [String],
    optional: true
  },
  /**
    The calendar's current score (factoring in age)
  */
  score: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
    The calendar's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  status: {
    type: Number,
    optional: true,
    editableBy: ["admin"],
    autoValue: function () {
      // only provide a default value
      // 1) this is an insert operation
      // 2) status field is not set in the document being inserted
      var user = Meteor.users.findOne(this.userId);
      if (this.isInsert && !this.isSet)
        return Calendars.getDefaultStatus(user);
    },
    autoform: {
      noselect: true,
      options: Calendars.config.calendarStatuses,
      group: 'admin'
    }
  },
  /**
    Whether the calendar is sticky (pinned to the top of calendars lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      leftLabel: "Sticky"
    }
  },
  /**
    Whether the calendar is inactive. Inactive calendars see their score recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true
  },
  /**
    The calendar author's name
  */
  author: {
    type: String,
    optional: true
  },
  /**
    The calendar author's `_id`.
  */
  userId: {
    type: String,
    optional: true,
    // regEx: SimpleSchema.RegEx.Id,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      options: function () {
        return Meteor.users.find().map(function (user) {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          };
        });
      }
    }
  }
});

// schema transforms
Meteor.startup(function(){
  // needs to happen after every fields were added
  Calendars.internationalize();
});

/**
 * Attach schema to Calendars collection
 */
Calendars.attachSchema(Calendars.schema);

Calendars.allow({
  update: _.partial(Telescope.allowCheck, Calendars),
  remove: _.partial(Telescope.allowCheck, Calendars)
});

