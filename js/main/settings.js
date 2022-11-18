// Setup settings
App.setup_settings = function () {
  App.create_window({id: "settings", setup: function () {
    // Selects
    for (let select of App.els(".settings_select")) {
      let setting = select.dataset.setting

      let el = App.el(`#settings_${setting}`)
      el.value = App.settings[setting]
    
      App.ev(el, "change", function () {
        App.settings[setting] = el.value
        App.stor_save_settings()
      })  
    }

    // Checkboxes
    for (let box of App.els(".settings_checkbox")) {
      let setting = box.dataset.setting

      let el = App.el(`#settings_${setting}`)
      el.checked = App.settings[setting]
    
      App.ev(el, "change", function () {
        App.settings[setting] = el.checked
        App.stor_save_settings()
      })
    }

    // Input Texts
    for (let text of App.els(".settings_small_text")) {
      let setting = text.dataset.setting
      let type = text.dataset.type

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
        })
      } else if (type === "number") {
        let el = App.el(`#settings_${setting}`)
        el.value = App.settings[setting].toLocaleString()
    
        App.ev(el, "blur", function () {
          let val = App.string_to_int(el.value)
    
          if (isNaN(val)) {
            val = App.default_settings[setting]
          }
    
          el.value = val.toLocaleString()
          App.settings[setting] = val
          App.stor_save_settings()
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