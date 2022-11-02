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

    let window_order = App.el("#window_order")

    for (let m of App.state.window_order) {
      let el = App.create("div", "window_order_item flex_row_center gap_2")
      el.dataset.mode = m

      let up = App.create("button", "button")
      up.textContent = "Up"
      el.append(up)

      App.ev(up, "click", function () {
        App.window_order_up(el)
      })

      let text = App.create("div", "window_order_item_text")
      text.textContent = App.item_name(m)
      el.append(text)

      let down = App.create("button", "button")
      down.textContent = "Down"
      el.append(down)

      App.ev(down, "click", function () {
        App.window_order_down(el)
      })      

      window_order.append(el)
    }
  }}) 
}

// Show the about window
App.show_about = async function () {
  let tab_count = await App.get_tab_count()
  let s = App.plural(tab_count.all, "tab", "tabs")
  let p = App.plural(tab_count.pins, "pin", "pins")
  App.el("#about_stats").textContent = `${s} open (${p})`
  App.windows["about"].show()
}