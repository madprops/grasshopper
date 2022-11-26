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
  text_size: 17,
  search_engine: "https://google.com/search?q=",
  tab_sort_mode: "index"
}

// Settings action list after mods
App.settings_do_action = function (what) {
  if (what === "theme") {
    App.apply_theme()
  }
}

// Setup checkboxes in a container
App.settings_setup_checkboxes = function (container) {
  let items = App.els(".settings_checkbox", container) 

  for (let item of items) {
    let setting = item.dataset.setting
    let action = item.dataset.action

    let el = App.el(`#settings_${setting}`)
    el.checked = App.settings[setting]
  
    App.ev(el, "change", function () {
      App.settings[setting] = el.checked
      App.stor_save_settings()
      App.settings_do_action(action)
    })
  }
}

// Setup text elements in a container
App.settings_setup_text = function (container) {
  let items = App.els(".settings_text", container).concat(App.els(".settings_text_long", container))

  for (let item of items) {
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
      App.settings_do_action(action)  
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
        App.settings_do_action(action)          
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
}

// Prepare a select menu
App.settings_make_menu = function (id, opts) {
  let el = App.el(`#settings_${id}`)

  App.ev(el, "click", function () {
    let items = []

    for (let o of opts) {
      let selected = App.settings[id] === o[1]

      items.push({
        text: o[0],
        action: function () {
          el.textContent = o[0]
          App.settings[id] = o[1]
          App.stor_save_settings()
        },
        selected: selected
      })  
    }

    NeedContext.show_on_element(this, items, true, this.clientHeight)  
  })

  for (let o of opts) {
    if (App.settings[id] === o[1]) {
      el.textContent = o[0]
    }
  }    
}

// Setup settings
App.setup_settings = function () {
  function on_x () {
    App.show_last_window()
  }

  App.create_window({id: "settings_basic", setup: function () {
    App.start_basic_settings()
  }, on_x: on_x}) 

  App.create_window({id: "settings_theme", setup: function () {
    App.start_theme_settings()
  }, on_x: on_x})  

  App.create_window({id: "settings_advanced", setup: function () {
    App.start_advanced_settings()
  }, on_x: on_x})   

  App.create_window({id: "settings", setup: function () {
    App.ev(App.el("#settings_show_basic"), "click", function () {
      App.show_window("settings_basic")
    })

    App.ev(App.el("#settings_show_advanced"), "click", function () {
      App.show_window("settings_advanced")
    })
    
    App.ev(App.el("#settings_show_theme"), "click", function () {
      App.show_window("settings_theme")
    })

    App.ev(App.el("#settings_defaults_button"), "click", function () {
      App.stor_reset_settings()
    })    
  }}) 
}

// Start basic settings
App.start_basic_settings = function () {
  let container = App.el("#settings_basic_container")
  App.settings_setup_checkboxes(container)
  App.settings_setup_text(container)
  App.settings_make_menu("text_mode", [["Title", "title"], ["URL", "url"]])

  let sort_mode_items = [
    ["Index", "index"], 
    ["Access", "access"],
    ["Title", "title"],
    ["Type", "type"]
  ]

  App.settings_make_menu("tab_sort_mode", sort_mode_items)
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

// Start advanced settings
App.start_advanced_settings = function () {
  let container = App.el("#settings_advanced_container")
  App.settings_setup_text(container)

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
}