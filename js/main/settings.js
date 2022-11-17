// Setup settings
App.setup_settings = function () {
  App.create_window({id: "settings", setup: function () {
    let manifest = browser.runtime.getManifest()
    let s = `Grasshopper v${manifest.version}`
    App.el("#settings_name").textContent = s
  
    let text_mode = App.el("#settings_text_mode")
    text_mode.value = App.settings.text_mode
  
    App.ev(text_mode, "change", function () {
      App.settings.text_mode = text_mode.value
      App.stor_save_settings()
    })  

    let warn_on_tab_close = App.el("#settings_warn_on_tab_close")
    warn_on_tab_close.value = App.settings.warn_on_tab_close ? "warn" : "no_warn"
  
    App.ev(warn_on_tab_close, "change", function () {
      App.settings.warn_on_tab_close = warn_on_tab_close.value === "warn"
      App.stor_save_settings()
    })

    let pin_icon = App.el("#settings_pin_icon")
    pin_icon.value = App.settings.pin_icon

    App.ev(pin_icon, "blur", function () {
      let pin = pin_icon.value.trim()

      if (!pin) {
        pin = App.default_settings.pin_icon
      }

      pin_icon.value = pin
      App.settings.pin_icon = pin
      App.stor_save_settings()
    })

    let in_window_icon = App.el("#settings_in_window_icon")
    in_window_icon.value = App.settings.in_window_icon

    App.ev(in_window_icon, "blur", function () {
      let pin = in_window_icon.value.trim()

      if (!pin) {
        pin = App.default_settings.in_window_icon
      }

      in_window_icon.value = pin
      App.settings.in_window_icon = pin
      App.stor_save_settings()
    })    

    let history_max_results = App.el("#settings_history_max_results")
    history_max_results.value = App.settings.history_max_results.toLocaleString()

    App.ev(history_max_results, "blur", function () {
      let num = App.string_to_int(history_max_results.value)

      if (isNaN(num)) {
        num = App.default_settings.history_max_results
      }

      history_max_results.value = num.toLocaleString()
      App.settings.history_max_results = num
      App.stor_save_settings()
    })

    let history_max_months = App.el("#settings_history_max_months")
    history_max_months.value = App.settings.history_max_months.toLocaleString()

    App.ev(history_max_months, "blur", function () {
      let num = App.string_to_int(history_max_months.value)

      if (isNaN(num)) {
        num = App.default_settings.history_max_months
      }

      history_max_months.value = num.toLocaleString()
      App.settings.history_max_months = num
      App.stor_save_settings()
    })  
  
    let all_windows = App.el("#settings_all_windows")
    all_windows.checked = App.settings.all_windows

    App.ev(all_windows, "change", function () {
      App.settings.all_windows = all_windows.checked
      App.stor_save_settings()
    })

    function start_color_picker (name) {
      App[`${name}_color_picker`] = AColorPicker.createPicker(App.el(`#${name}_color_picker`), {
        showAlpha: false,
        showHSL: false,
        showHEX: false,
        showRGB: true,
        color: App.settings[`${name}_color`]
      })
  
      let change_color = App.create_debouncer(function (color) {
        App.do_change_color(name, color)
      }, App.color_delay)
  
      App[`${name}_color_picker`].on("change", function (picker, color) {
        change_color(color)
      })        
    }

    start_color_picker("background")
    start_color_picker("text")

    App.ev(App.el("#settings_dark_theme"), "click", function () {
      App.random_theme("dark")
    })

    App.ev(App.el("#settings_light_theme"), "click", function () {
      App.random_theme("light")
    })

    App.ev(App.el("#settings_detect_theme"), "click", function () {
      App.detect_theme()
    })

    let item_order = App.el("#item_order")

    for (let m of App.item_order) {
      let el = App.create("div", "item_order_item flex_row_center gap_2")
      el.dataset.mode = m

      let text = App.create("div", "item_order_item_text")
      text.textContent = App.capitalize(m)
      el.append(text)

      let up = App.create("button", "button up_down_button")
      up.textContent = "Up"
      el.append(up)

      App.ev(up, "click", function () {
        App.item_order_up(el)
      })      

      let down = App.create("button", "button up_down_button")
      down.textContent = "Down"
      el.append(down)

      App.ev(down, "click", function () {
        App.item_order_down(el)
      })      

      item_order.append(el)
    }

    App.ev(App.el("#settings_defaults_button"), "click", function () {
      App.stor_reset_settings()
    })
  }}) 
}