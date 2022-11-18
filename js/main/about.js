// Setup about
App.setup_about = function () {
  App.create_window({id: "about", setup: function () {
    let manifest = browser.runtime.getManifest()
    let s = `Grasshopper v${manifest.version}`
    App.el("#about_name").textContent = s
  }})
}