function alertThanks (post) {
  alert("Thanks for submitting a project!");
  return post;
}
Telescope.callbacks.add("postSubmitClient", alertThanks);