// Default settings values
App.default_settings = {
  text_mode: {value: "title", category: "basic"},
  tabs_index: {value: 0, category: "basic"},
  bookmarks_index: {value: 1, category: "basic"},
  history_index: {value: 2, category: "basic"},
  closed_index: {value: 3, category: "basic"},
  lock_drag: {value: false, category: "basic"},
  width: {value: 90, category: "basic"},
  height: {value: 100, category: "basic"},
  font: {value: "gh_sans", category: "basic"},
  font_size: {value: 18, category: "basic"},
  media_viewer: {value: true, category: "basic"},
  background_color: {value: "rgb(43, 42, 51)", category: "theme"},
  text_color: {value: "rgb(251, 251, 254)", category: "theme"},
  background_image: {value: "none", category: "theme"},
  pin_icon: {value: "(+)", category: "icons"},
  playing_icon: {value: "(Playing)", category: "icons"},
  muted_icon: {value: "(Muted)", category: "icons"},
  suspended_icon: {value: "(zzz)", category: "icons"},
}

// Start item order
App.start_item_order = function () {
  let item_order = App.el("#settings_item_order")

  for (let m of App.item_order) {
    let row = App.create("div", "item_order_row")
    row.dataset.mode = m

    let up = App.create("div", "button item_order_button")
    up.textContent = "Up"
    row.append(up)

    App.ev(up, "click", function () {
      App.item_order_up(row)
    })

    let text = App.create("div", "item_order_item_text")
    text.textContent = App.get_mode_name(m)
    row.append(text)

    let down = App.create("div", "button item_order_button")
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
  let items = App.els(".settings_text", container)

  for (let item of items) {
    let setting = item.dataset.setting
    let action = item.dataset.action
    let el = App.el(`#settings_${setting}`)

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

  let buttons = App.create("div", "flex_row_center gap_1")
  let prev = App.create("div", "button")
  prev.textContent = "<"
  let next = App.create("div", "button")
  next.textContent = ">"

  function prev_fn () {
    App.settings_menu_cycle(el, id, "prev", opts)
    App.apply_theme()
  }

  function next_fn () {
    App.settings_menu_cycle(el, id, "next", opts)
    App.apply_theme()
  }

  App.ev(prev, "click", prev_fn)
  App.ev(next, "click", next_fn)

  buttons.append(prev)
  buttons.append(next)
  el.after(buttons)
  prev.after(el)
}

// Setup settings
App.setup_settings = function () {
  App.settings_order = ["settings_basic", "settings_theme", "settings_icons"]

  App.create_window({id: "settings_basic", setup: function () {
    let container = App.el("#settings_basic_container")
    App.settings_setup_checkboxes(container)
    App.settings_make_menu("text_mode", [["Title", "title"], ["URL", "url"]])

    App.settings_make_menu("width", App.get_size_options(), function () {
      App.apply_theme()
    })

    App.settings_make_menu("height", App.get_size_options(), function () {
      App.apply_theme()
    })

    App.start_item_order()

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
      ["Alien", "gh_alien"],
    ], function () {
      App.apply_theme()
    })

    App.settings_make_menu("font_size", App.get_font_size_options(), function () {
      App.apply_theme()
    })

    App.ev(App.el("#settings_defaults_basic"), "click", function () {
      App.restore_default_settings("basic")
    })

    App.add_settings_switchers("basic")
  }, persistent: false})

  App.create_window({id: "settings_theme", setup: function () {
    App.start_theme_settings()
    App.add_settings_switchers("theme")
  }, persistent: false})

  App.create_window({id: "settings_icons", setup: function () {
    let container = App.el("#settings_icons_container")
    App.settings_setup_text(container)

    App.ev(App.el("#settings_default_icons"), "click", function () {
      App.restore_default_settings("icons")
    })

    App.add_settings_switchers("icons")
  }, persistent: false})
}

// Create settings title switchers
App.add_settings_switchers = function (category) {
  let title = App.el(".settings_title", App.el(`#settings_${category}_container`))

  let prev = App.create("div", "button")
  prev.textContent = "<"
  title.before(prev)

  App.ev(prev, "click", function () {
    App.show_prev_settings()
  })

  let next = App.create("div", "button")
  next.textContent = ">"
  title.after(next)

  App.ev(next, "click", function () {
    App.show_next_settings()
  })
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
      change_color.call(color)
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
}

// Cycle to prev or next item
App.settings_menu_cycle = function (el, setting, dir, items) {
  let cycle = true

  if (setting === "font_size" || setting === "width" || setting === "height") {
    cycle = false
  }

  let waypoint = false
  items = items.slice(0)

  if (dir === "prev") {
    items.reverse()
  }

  let s_item

  if (cycle) {
    s_item = items[0]
  }

  for (let item of items) {
    if (waypoint) {
      s_item = item
      break
    }

    if (item[1] === App.settings[setting]) {
      waypoint = true
    }
  }

  if (s_item) {
    el.textContent = s_item[0]
    App.settings[setting] = s_item[1]
    App.stor_save_settings()
  }
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
    App.apply_theme()
    App.show_window(`settings_${type}`)
  })
}

// Get background image options
App.get_background_image_options = function () {
  let opts = [["None", "none"]]

  for (let i=1; i<=App.num_background_images; i++) {
    let ii = i.toString()
    let ns = App.fillpad(ii, 2, 0)
    opts.push([`BG ${ns}`, ii])
  }

  return opts
}

// Get text size options
App.get_font_size_options = function () {
  let opts = []

  for (let i=14; i<=22; i++) {
    opts.push([`${i} px`, i])
  }

  return opts
}

// Get size options
App.get_size_options = function () {
  let opts = []

  for (let i=60; i<=100; i+=5) {
    opts.push([`${i}%`, i])
  }

  return opts
}

// Got to prev settings
App.show_prev_settings = function () {
  let index = App.settings_order.indexOf(App.window_mode)
  index -= 1

  if (index < 0) {
    index = App.settings_order.length - 1
  }

  App.show_window(App.settings_order[index])
}

// Got to next settings
App.show_next_settings = function () {
  let index = App.settings_order.indexOf(App.window_mode)
  index += 1

  if (index >= App.settings_order.length) {
    index = 0
  }

  App.show_window(App.settings_order[index])
}

// Reset all settings
App.reset_settings = function () {
  App.show_confirm("Reset all settings to defaults?", function () {
    App.settings = {}
    App.stor_save_settings()
    window.close()
  })
}