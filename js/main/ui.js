// Arrange items depending on space
App.setup_ui = function () {
  let top = App.el("#top_container")
  
  if (top.scrollWidth > top.clientWidth) {
    App.el("#top_container").classList.add("top_container_column")
  }
}