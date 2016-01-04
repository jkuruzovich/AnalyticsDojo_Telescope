
FlowRouter.route('/dashboard', {
  name: "dashboardDefault",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "dashboard_main"});
  }
});

