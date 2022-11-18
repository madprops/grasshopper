// Default settings values
App.default_settings = {
  text_mode: "title",
  background_color: "rgb(37, 41, 51)",
  text_color: "rgb(220, 220, 220)",
  tabs_index: 0,
  stars_index: 1,
  history_index: 2,
  closed_index: 3,
  warn_on_tab_close: true,
  pin_icon: "+",
  window_icon: "w",
  history_max_results: 1000,
  history_max_months: 24,
  all_windows: true,
  text_size: 17
}

// Setup settings
App.setup_settings = function () {
  App.create_window({id: "settings", setup: function () {
    function do_action (what) {
      if (what === "theme") {
        App.apply_theme()
      }
    }

    // Selects
    for (let item of App.els(".settings_select")) {
      let setting = item.dataset.setting
      let action = item.dataset.action

      let el = App.el(`#settings_${setting}`)
      el.value = App.settings[setting]
    
      App.ev(el, "change", function () {
        App.settings[setting] = el.value
        App.stor_save_settings()
        do_action(action)        
      })
    }

    // Checkboxes
    for (let item of App.els(".settings_checkbox")) {
      let setting = item.dataset.setting
      let action = item.dataset.action

      let el = App.el(`#settings_${setting}`)
      el.checked = App.settings[setting]
    
      App.ev(el, "change", function () {
        App.settings[setting] = el.checked
        App.stor_save_settings()
        do_action(action)
      })
    }

    // Input Texts
    for (let item of App.els(".settings_small_text")) {
      let setting = item.dataset.setting
      let type = item.dataset.type
      let min = parseInt(item.dataset.min)
      let max = parseInt(item.dataset.max)
      let action = item.dataset.action

      if (type === "text") {
        let el = App.el(`#settings_${setting}`)
        el.value = App.settings[setting]
    
        App.ev(el, "blur", function () {
          let val = el.value.trim()
    
          if (!val) {
            val = App.default_settings[setting]
          }
    
          el.value = val
          App.settings[setting] = val
          App.stor_save_settings()
          do_action(action)          
        })
      } else if (type === "number") {
        let el = App.el(`#settings_${setting}`)
        el.value = App.settings[setting].toLocaleString()
    
        App.ev(el, "blur", function () {
          let val = parseInt(el.value)
    
          if (isNaN(val)) {
            val = App.default_settings[setting]
          }

          if (min && min > val) {
            val = min
          } else if (max && max < val) {
            val = max
          }
    
          el.value = val.toLocaleString()
          App.settings[setting] = val
          App.stor_save_settings()
          do_action(action)          
        })
      }
    }

    // Item Order
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

    // Color Pickers
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

    // Themes
    App.ev(App.el("#settings_dark_theme"), "click", function () {
      App.random_theme("dark")
    })

    App.ev(App.el("#settings_light_theme"), "click", function () {
      App.random_theme("light")
    })

    App.ev(App.el("#settings_detect_theme"), "click", function () {
      App.detect_theme()
    })

    App.ev(App.el("#settings_defaults_button"), "click", function () {
      App.stor_reset_settings()
    })
  }}) 
}