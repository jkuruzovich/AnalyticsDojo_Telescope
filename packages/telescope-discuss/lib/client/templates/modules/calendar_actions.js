Template.calendar_actions.events({
  'click .toggle-actions-link': function(e){
    e.preventDefault();
    var $calendar = $(e.target).parents('.calendar');
    var h = $calendar.height();
    if ($calendar.hasClass('show-actions')) {
      $calendar.height('auto');
      $calendar.removeClass('show-actions');
    } else {
      $calendar.height(h+'px');
      $calendar.addClass('show-actions');
    }
  }
});
