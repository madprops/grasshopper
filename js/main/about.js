// Setup about
App.setup_about = function () {
  App.create_window({id:"about", top: "panel"})
  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  App.el("#about_name").textContent = s

  App.ev(App.el("#about_button"), "click", function () {  
    App.windows["about"].show()
  })
}