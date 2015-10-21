// Custom Post Field

Posts.removeField("url")
Comments.removeField("body")

Posts.addField({
    fieldName: 'siteUrl',
    fieldSchema: {
        type: String,
        optional: true,
        autoform: {
            omit: true
        }
    }
});


Posts.addField(
    {
  fieldName: "orgName",
  fieldSchema: {
    type: String,
    optional: false,
    editableBy: ["member", "admin"]
  }
});


Posts.addField(
    {
        fieldName: "orgWebsite",
        fieldSchema: {
            type: String,
            label: "Website",
            optional: true,
            editableBy: ["member", "admin"]
        }
    });

Posts.addField(
    {
        fieldName: 'contactName',
        fieldSchema: {
            type: String,
            label: "Contact Name",
            optional: true,
            editableBy: ["member", "admin"]
        }
    });

Posts.addField(
    {
        fieldName: 'contactPhone',
        fieldSchema: {
            type: String,
            label: "Contact Phone Number",
            optional: true,
            editableBy: ["member", "admin"]
        }
    });

Posts.addField(
    {
        fieldName: 'contactEmail',
        fieldSchema: {
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            label: "Contact email",
            optional: true,
            editableBy: ["member", "admin"]
        }
    });

Posts.addField({
    fieldName: 'url',
    fieldSchema: {
        type: String,
        label: "Logo Url",
        optional: true,
        editableBy: ["member", "admin"],
        autoform: {
            type: 'bootstrap-postthumbnail'
        }
    }
});

// Custom Comment Field

Comments.addField({
    fieldName: 'body',
    fieldSchema: {
        type: String,
        optional: false,
        editableBy: ["member", "admin"],
        autoform: {
            group: 'Activities Performed',
            rows: 3
        }
    }
});

Comments.addField({
  fieldName: 'serviceDate',
  fieldSchema: {
    type: Date,
    optional: false,
    editableBy: ["member", "admin"],
      autoform: {
          group: 'schedule',
          type: "bootstrap-datetimepicker"
      }
  }
});



Comments.addField({
    fieldName: 'hours',
    fieldSchema: {
        type: Number,
        optional: false,
        editableBy: ["member", "admin"],
        autoform: {
            group: 'schedule'

        }
    }
});

// Custom User Field

Users.addField({
  fieldName: 'customUserField',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"]
  }
});

// Custom Setting Field

Settings.addField({
  fieldName: "customSettingsField",
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      group: "customGroup"
    }
  }
});



