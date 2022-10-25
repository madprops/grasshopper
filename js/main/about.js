// Setup about
App.setup_about = function () {
  App.create_window({id: "about"})
  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  App.el("#about_name").textContent = s

  App.ev(App.el("#about_button"), "click", function () {
    let s = App.plural(App.tabs.length, "tab", "tabs")
    App.el("#about_stats").textContent = `${s} open`
    App.windows["about"].show()
  })
}