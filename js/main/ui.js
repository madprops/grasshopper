// Arrange items depending on space
App.setup_ui = function () {
  let top = App.el("#top_container")
  
  if (top.scrollWidth > top.clientWidth) {
    App.el("#top_container").classList.add("top_container_column")
  }
}

// Set version in trademark
App.set_version = function () {
  let manifest = browser.runtime.getManifest()
  App.el("#version").textContent = `v${manifest.version}`
}