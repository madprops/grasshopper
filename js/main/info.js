// Arrange items depending on space
App.setup_info = function () {
  App.ev(App.el("#configure_button"), "click", function () {  
    App.show_configure()
  })
  
  App.ev(App.el("#help_button"), "click", function () {
    App.show_help()
  })

  let manifest = browser.runtime.getManifest()
  App.el("#version").textContent = `v${manifest.version}`
}