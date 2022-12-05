// Default settings values
App.default_settings = {
  text_mode: {value: "title", category: "normal"},
  tabs_index: {value: 0, category: "normal"},
  stars_index: {value: 1, category: "normal"},
  history_index: {value: 2, category: "normal"},
  closed_index: {value: 3, category: "normal"},
  text_size: {value: 18, category: "normal"},
  lock_drag: {value: false, category: "normal"},
  font: {value: "gh_sans", category: "normal"},
  background_color: {value: "rgb(88, 92, 111)", category: "theme"},
  text_color: {value: "rgb(234, 238, 255)", category: "theme"},
  background_image: {value: "none", category: "theme"},
  pin_icon: {value: "(+)", category: "icons"},
  playing_icon: {value: "(Playing)", category: "icons"},
  muted_icon: {value: "(Muted)", category: "icons"},
  suspended_icon: {value: "(Suspended)", category: "icons"},
}

// Start item order
App.start_item_order = function () {
  let item_order = App.el("#settings_item_order")

  for (let m of App.item_order) {
    let row = App.create("div", "item_order_row")
    row.dataset.mode = m

    let up = App.create("div", "button up_down_button")
    up.textContent = "Up"
    row.append(up)

    App.ev(up, "click", function () {
      App.item_order_up(row)
    })     
    
    let text = App.create("div", "item_order_item_text")
    text.textContent = App.capitalize(m)
    row.append(text)

    let down = App.create("div", "button up_down_button")
    down.textContent = "Down"
    row.append(down)

    App.ev(down, "click", function () {
      App.item_order_down(row)
    })      

    item_order.append(row)
  }
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
        val = App.default_settings[setting].value
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
          val = App.default_settings[setting].value
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
App.settings_make_menu = function (id, opts, action) {
  if (!action) {
    action = function () {}
  }

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
          action()
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

  App.create_window({id: "settings_theme", setup: function () {
    App.start_theme_settings()
  }, on_x: on_x}) 

  App.create_window({id: "settings_icons", setup: function () {
    let container = App.el("#settings_icons_container")
    App.settings_setup_text(container)

    App.ev(App.el("#settings_default_icons"), "click", function () {
      App.restore_default_settings("icons")
    })
  }, on_x: on_x})  

  App.create_window({id: "settings", setup: function () {
    let container = App.el("#settings_container")
    App.settings_setup_checkboxes(container)
    App.settings_setup_text(container)
    App.settings_make_menu("text_mode", [["Title", "title"], ["URL", "url"]])
    App.settings_make_menu("font", [
      ["Sans", "gh_sans"], 
      ["Serif", "gh_serif"],
      ["Mono", "gh_mono"],
      ["Comic", "gh_comic"],
      ["Cursive", "gh_cursive"],
      ["Funone", "gh_funone"],
      ["Cyber", "gh_cyber"],
      ["Neat", "gh_neat"],
      ["Cool", "gh_cool"],
    ], function () {
      App.apply_theme()
    })

    App.start_item_order()

    App.ev(App.el("#settings_show_theme"), "click", function () {
      App.show_window("settings_theme")
    })

    App.ev(App.el("#settings_show_icons"), "click", function () {
      App.show_window("settings_icons")
    })    

    App.ev(App.el("#settings_defaults_button"), "click", function () {
      App.restore_default_settings("normal")
    })    
  }}) 
}

// Start theme settings
App.start_theme_settings = function () {
  function start_color_picker (name) {
    let el = App.el(`#settings_${name}_color_picker`)

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
  
  App.ev(App.el("#settings_default_theme"), "click", function () {
    App.restore_default_settings("theme")
  })

  let imgs = App.get_background_image_options()

  App.settings_make_menu("background_image", imgs, function () {
    App.apply_theme()
  })

  App.ev(App.el("#settings_background_image_prev"), "click", function () {
    App.switch_background_image("prev", imgs)
  })

  App.ev(App.el("#settings_background_image_next"), "click", function () {
    App.switch_background_image("next", imgs)
  })
}

// Switch background image
App.switch_background_image = function (dir, items) {
  let waypoint = false
  let imgs = items.slice(0)

  if (dir === "prev") {
    imgs.reverse()
  }

  let s_img = imgs[0]

  for (let img of imgs) {
    if (waypoint) {
      s_img = img
      break
    }
    
    if (img[1] === App.settings.background_image) {
      waypoint = true
    }
  }

  App.el("#settings_background_image").textContent = s_img[0]
  App.settings.background_image = s_img[1]
  App.apply_theme()
  App.stor_save_settings()
}

// Restore default settings
App.restore_default_settings = function (type) {
  App.show_confirm(`Restore default settings? (${type})`, function () {
    for (let key in App.default_settings) {
      let item = App.default_settings[key]
  
      if (item.category === type) {
        App.settings[key] = item.value
      }
    }

    App.stor_save_settings()
    window.close()    
  })
}