Template.calendar_vote.helpers({
  enableDownvotes: function () {
    return Settings.get("enableDownvotes", false);
  },
  actionsClass: function () {
    var user = Meteor.user();
    var actionsClass = "";
    if(!user) return false;
    if (user.hasUpvoted(this)) {
      actionsClass += " voted upvoted";
    }
    if (user.hasDownvoted(this)) {
      actionsClass += " voted downvoted";
    }
    if (Settings.get("enableDownvotes", false)) {
      actionsClass += " downvotes-enabled";
    }
    return actionsClass;
  }
});

Template.calendar_vote.events({
  'click .upvote-link': function(e){
    var calendar = this;
    var user = Meteor.user();
    e.preventDefault();
    if(!user){
      FlowRouter.go('signIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    } else if (user.hasUpvoted(calendar)) {
      Meteor.call('cancelUpvoteCalendar', calendar._id, function(){
        Events.track("calendar upvote cancelled", {'_id': calendar._id});
      });        
    } else {
      Meteor.call('upvoteCalendar', calendar._id, function(){
        Events.track("calendar upvoted", {'_id': calendar._id});
      });  
    }
  },
  'click .downvote-link': function(e){
    var calendar = this;
    var user = Meteor.user();
    e.preventDefault();
    if(!user){
      FlowRouter.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    if (user.hasDownvoted(calendar)) {
      Meteor.call('cancelDownvoteCalendar', calendar._id, function(){
        Events.track("calendar downvote cancelled", {'_id': calendar._id});
      });        
    } else {
      Meteor.call('downvoteCalendar', calendar._id, function(){
        Events.track("calendar downvoted", {'_id': calendar._id});
      });  
    }
  }  
});
