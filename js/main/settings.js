// Default settings values
App.default_settings = {
  text_mode: "title",
  background_color: "rgb(88, 92, 111)",
  text_color: "rgb(234, 238, 255)",
  tabs_index: 0,
  stars_index: 1,
  history_index: 2,
  closed_index: 3,
  all_windows: true,
  text_size: 18,
  search_engine: "https://google.com/search?q="
}

// Setup settings
App.setup_settings = function () {
  function on_x () {
    App.show_last_window()
  }

  App.create_window({id: "settings_basic", setup: function () {
    App.start_basic_settings()
  }, on_x: on_x})

  App.create_window({id: "settings_order", setup: function () {
    App.start_order_settings()
  }, on_x: on_x})  

  App.create_window({id: "settings_theme", setup: function () {
    App.start_theme_settings()
  }, on_x: on_x})  

  App.create_window({id: "settings", setup: function () {
    App.ev(App.el("#settings_show_basic"), "click", function () {
      App.show_window("settings_basic")
    })

    App.ev(App.el("#settings_show_order"), "click", function () {
      App.show_window("settings_order")
    })
    
    App.ev(App.el("#settings_show_theme"), "click", function () {
      App.show_window("settings_theme")
    })

    App.ev(App.el("#settings_defaults_button"), "click", function () {
      App.stor_reset_settings()
    })    
  }}) 
}

// Start theme settings
App.start_theme_settings = function () {
  function start_color_picker (name) {
    let el = App.el(`#${name}_color_picker`)

    App[`${name}_color_picker`] = AColorPicker.createPicker(el, {
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
}

// Start window order
App.start_order_settings = function () {
  let container = App.el("#item_order")

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

    container.append(el)
  }  
}

// Start basic settings
App.start_basic_settings = function () {
  function do_action (what) {
    if (what === "theme") {
      App.apply_theme()
    }
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
  for (let item of App.els(".settings_text").concat(App.els(".settings_text_long"))) {
    let setting = item.dataset.setting
    let type = item.dataset.type
    let min = parseInt(item.dataset.min)
    let max = parseInt(item.dataset.max)
    let action = item.dataset.action
    let el = App.el(`#settings_${setting}`)

    function set_number (val) {
      val = parseInt(val)
  
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
    }    

    if (type === "text") {
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
      el.value = App.settings[setting].toLocaleString()
  
      App.ev(el, "blur", function () {
        set_number(el.value)
      })

      App.ev(App.el(`#settings_${setting}_minus`), "click", function () {
        set_number(App.settings[setting] - 1)
      })
      
      App.ev(App.el(`#settings_${setting}_plus`), "click", function () {
        set_number(App.settings[setting] + 1)
      })
    }
  }  

  let text_mode = App.el("#settings_text_mode")

  App.ev(text_mode, "click", function () {
    let items = []

    items.push({
      text: "Title",
      action: function () {
        text_mode.textContent = "Title"
        App.settings.text_mode = "title"
        App.stor_save_settings()
      },
      selected: App.settings.text_mode === "title"
    })

    items.push({
      text: "URL",
      action: function () {
        text_mode.textContent = "URL"
        App.settings.text_mode = "url"
        App.stor_save_settings()
      },
      selected: App.settings.text_mode === "url"
    })

    NeedContext.show_on_element(this, items, true, this.clientHeight)
  })

  text_mode.textContent = App.settings.text_mode === "url" ? "URL" : "Title"
}