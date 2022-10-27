// Setup about
App.setup_about = function () {
  App.create_window("about")
  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  App.el("#about_name").textContent = s

  App.ev(App.el("#about_button"), "click", function () {
    let s = App.plural(App.tabs_items.length, "tab", "tabs")
    let p = App.plural(App.get_pinned_tabs().length, "pin", "pins")
    App.el("#about_stats").textContent = `${s} open (${p})`
    App.windows["about"].show()
  })

  App.ev(App.el("#about_close_all"), "click", function () {
    App.close_all_tabs()
  })

  let text_mode = App.el("#about_text_mode")
  text_mode.value = App.state.text_mode

  App.ev(text_mode, "change", function () {
    App.state.text_mode = text_mode.value
    App.save_state()
    App.show_tabs()
  })
}