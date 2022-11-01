// Setup about
App.setup_about = function () {
  App.create_window({id: "about", setup: function () {
    let manifest = browser.runtime.getManifest()
    let s = `Grasshopper v${manifest.version}`
    App.el("#about_name").textContent = s
  
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
  
    let history_results = App.el("#about_history_results")
    history_results.value = App.state.history_results
  
    App.ev(history_results, "change", function () {
      App.state.history_results = history_results.value
      App.save_state()
    })  
  
    App.ev(App.el("#about_history_results_info"), "click", function () {
      App.show_history_results_info()
    })  
  
    let color = AColorPicker.createPicker(App.el("#color_picker"), {
      showAlpha: false,
      showHSL: false,
      showHEX: false,
      showRGB: true,
      color: App.state.color
    })

    let change_color = App.create_debouncer(function (color) {
      App.do_change_color(color)
    }, App.color_delay)

    color.on("change", function (picker, color) {
      change_color(color)
    })  
  }}) 
}

// Show the about window
App.show_about = function () {
  let s = App.plural(App.tabs_items.length, "tab", "tabs")
  let p = App.plural(App.get_pinned_tabs().length, "pin", "pins")
  App.el("#about_stats").textContent = `${s} open (${p})`
  App.windows["about"].show()
}