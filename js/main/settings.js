App.default_settings = {
  smooth_scrolling: {value: true, category: `basic`, version: 1},
  text_mode: {value: `title`, category: `basic`, version: 1},
  item_height: {value: `normal`, category: `basic`, version: 1},
  width: {value: 70, category: `basic`, version: 1},
  height: {value: 80, category: `basic`, version: 1},
  font: {value: `sans-serif`, category: `basic`, version: 1},
  font_size: {value: 16, category: `basic`, version: 1},
  lock_drag: {value: false, category: `basic`, version: 1},
  quick_star: {value: false, category: `basic`, version: 1},

  background_color: {value: `rgb(70, 76, 94)`, category: `theme`, version: 1},
  text_color: {value: `rgb(218, 219, 223)`, category: `theme`, version: 1},
  background_image: {value: ``, category: `theme`, version: 1},

  pin_icon: {value: `+`, category: `icons`, version: 1},
  normal_icon: {value: ``, category: `icons`, version: 1},
  playing_icon: {value: `🔊`, category: `icons`, version: 1},
  muted_icon: {value: `🔇`, category: `icons`, version: 1},
  suspended_icon: {value: `💤`, category: `icons`, version: 1},

  media_viewer_on_tabs: {value: true, category: `media`, version: 2},
  media_viewer_on_history: {value: true, category: `media`, version: 1},
  media_viewer_on_bookmarks: {value: true, category: `media`, version: 1},
  media_viewer_on_closed: {value: true, category: `media`, version: 1},
  media_viewer_on_stars: {value: true, category: `media`, version: 1},

  warn_on_close: {value: `special`, category: `warns`, version: 3},
  warn_on_suspend: {value: `special`, category: `warns`, version: 3},
  warn_on_close_duplicates: {value: true, category: `warns`, version: 1},
  warn_on_clean: {value: true, category: `warns`, version: 1},
  warn_on_star: {value: true, category: `warns`, version: 1},
  warn_on_unstar: {value: true, category: `warns`, version: 1},
  warn_on_launch: {value: true, category: `warns`, version: 1},
  warn_on_untitle: {value: true, category: `warns`, version: 1},

  tabs_index: {value: 0, category: `order`, version: 1},
  history_index: {value: 1, category: `order`, version: 1},
  bookmarks_index: {value: 2, category: `order`, version: 1},
  closed_index: {value: 3, category: `order`, version: 1},
  stars_index: {value: 4, category: `order`, version: 1},

  gestures_enabled: {value: true, category: `gestures`, version: 1},
  gestures_threshold: {value: 10, category: `gestures`, version: 1},
  gesture_up: {value: `go_to_top`, category: `gestures`, version: 1},
  gesture_down: {value: `go_to_bottom`, category: `gestures`, version: 1},
  gesture_left: {value: `prev_window`, category: `gestures`, version: 1},
  gesture_right: {value: `next_window`, category: `gestures`, version: 1},
  gesture_up_and_down: {value: `none`, category: `gestures`, version: 1},
  gesture_left_and_right: {value: `none`, category: `gestures`, version: 1},

  switch_to_tabs: {value: true, category: `more`, version: 1},
  clear_filter: {value: true, category: `more`, version: 1},
  show_tooltips: {value: true, category: `more`, version: 1},
  show_icons: {value: true, category: `more`, version: 1},
  show_pinline: {value: true, category: `more`, version: 1},
  highlight_effect: {value: `rotate`, category: `more`, version: 1},
  close_on_focus: {value: true, category: `more`, version: 1},
  close_on_launch: {value: true, category: `more`, version: 1},
  show_scroller: {value: true, category: `more`, version: 1},
  show_footer: {value: true, category: `more`, version: 1},
  autoselect_tab: {value: true, category: `more`, version: 1},
}

App.make_item_order = () => {
  let item_order = DOM.el(`#settings_item_order`)
  item_order.innerHTML = ``

  for (let m of App.item_order) {
    let row = DOM.create(`div`, `item_order_row`)
    row.dataset.mode = m

    let up = DOM.create(`div`, `button item_order_button`)
    up.textContent = `Up`
    row.append(up)

    DOM.ev(up, `click`, () => {
      App.item_order_up(row)
    })

    let text = DOM.create(`div`, `item_order_item_text`)
    text.textContent = App.get_mode_name(m)
    row.append(text)

    let down = DOM.create(`div`, `button item_order_button`)
    down.textContent = `Down`
    row.append(down)

    DOM.ev(down, `click`, () => {
      App.item_order_down(row)
    })

    item_order.append(row)
  }
}

App.settings_do_action = (what) => {
  if (what === `theme`) {
    App.apply_theme()
  }
}

App.settings_setup_checkboxes = (container) => {
  let items = DOM.els(`.settings_checkbox`, container)

  for (let item of items) {
    let setting = item.dataset.setting
    let action = item.dataset.action

    let el = DOM.el(`#settings_${setting}`)
    el.checked = App.get_setting(setting)

    DOM.ev(el, `change`, () => {
      App.set_setting(setting, el.checked)
      App.settings_do_action(action)
    })

    DOM.ev(el, `contextmenu`, (e) => {
      App.reset_single_setting(e, () => {
        let value = App.default_setting(setting)
        App.set_setting(setting, value)
        el.checked = value
      })
    })
  }
}

App.settings_setup_text = (container) => {
  let items = DOM.els(`.settings_text`, container)

  for (let item of items) {
    let setting = item.dataset.setting
    let action = item.dataset.action
    let el = DOM.el(`#settings_${setting}`)

    el.value = App.get_setting(setting)

    DOM.ev(el, `blur`, () => {
      el.value = el.value.trim()
      App.set_setting(setting, el.value)
      App.settings_do_action(action)
    })

    DOM.ev(el, `contextmenu`, (e) => {
      App.reset_single_setting(e, () => {
        let value = App.default_setting(setting)
        App.set_setting(setting, value)
        el.value = value
        App.settings_do_action(action)
      })
    })
  }
}

App.settings_make_menu = (setting, opts, action = () => {}) => {
  let el = DOM.el(`#settings_${setting}`)

  DOM.ev(el, `click`, () => {
    let items = []

    for (let o of opts) {
      if (o[0] === `--separator--`) {
        items.push({separator: true})
        continue
      }

      let selected = App.get_setting(setting) === o[1]

      items.push({
        text: o[0],
        action: () => {
          el.textContent = o[0]
          App.set_setting(setting, o[1])
          action()
        },
        selected: selected
      })
    }

    NeedContext.show_on_element(el, items, true, el.clientHeight)
  })

  DOM.ev(el, `contextmenu`, (e) => {
    App.reset_single_setting(e, () => {
      let value = App.default_setting(setting)
      App.set_setting(setting, value)

      for (let o of opts) {
        if (o[1] === value) {
          el.textContent = o[0]
          break
        }
      }

      action()
    })
  })

  for (let o of opts) {
    if (App.get_setting(setting) === o[1]) {
      el.textContent = o[0]
    }
  }

  let buttons = DOM.create(`div`, `flex_row_center gap_1`)
  let prev = DOM.create(`div`, `button`)
  prev.textContent = `<`
  let next = DOM.create(`div`, `button`)
  next.textContent = `>`

  function prev_fn () {
    App.settings_menu_cycle(el, setting, `prev`, opts)
    action()
  }

  function next_fn () {
    App.settings_menu_cycle(el, setting, `next`, opts)
    action()
  }

  DOM.ev(prev, `click`, prev_fn)
  DOM.ev(next, `click`, next_fn)

  buttons.append(prev)
  buttons.append(next)
  el.after(buttons)
  prev.after(el)
}

App.setup_settings = () => {
  App.settings_categories = [`basic`, `theme`, `icons`, `media`, `warns`, `order`, `gestures`, `more`]

  let common = {
    persistent: false,
    colored_top: true,
    after_hide: () => {
      App.apply_theme()
    },
  }

  function prepare (category) {
    let container = DOM.el(`#settings_${category}_container`)
    App.settings_setup_checkboxes(container)
    App.settings_setup_text(container)
    App.add_settings_switchers(category)
  }

  App.create_window(Object.assign({}, common, {id: `settings_basic`, setup: () => {
    prepare(`basic`)

    App.settings_make_menu(`text_mode`, [[`Title`, `title`], [`URL`, `url`]])

    App.settings_make_menu(`width`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.settings_make_menu(`height`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.settings_make_menu(`font`, [
      [`Sans`, `sans-serif`],
      [`Serif`, `serif`],
      [`Mono`, `monospace`],
    ], () => {
      App.apply_theme()
    })

    App.settings_make_menu(`font_size`, App.get_font_size_options(), () => {
      App.apply_theme()
    })

    App.settings_make_menu(`item_height`, [
      [`Compact`, `compact`],
      [`Normal`, `normal`],
      [`Bigger`, `bigger`],
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_theme`, setup: () => {
    App.start_theme_settings()
    prepare(`theme`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_icons`, setup: () => {
    prepare(`icons`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_media`, setup: () => {
    prepare(`media`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_warns`, setup: () => {
    prepare(`warns`)
    App.settings_make_menu(`warn_on_close`, App.tab_warn_opts)
    App.settings_make_menu(`warn_on_suspend`, App.tab_warn_opts)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_order`, setup: () => {
    prepare(`order`)
    App.make_item_order()
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_more`, setup: () => {
    prepare(`more`)

    App.settings_make_menu(`highlight_effect`, [
      [`Rotate`, `rotate`],
      [`Invert`, `invert`],
      [`Bright`, `bright`],
      [`Blink`, `blink`],
      [`Hue`, `hue`],
      [`None`, `none`],
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_gestures`, setup: () => {
    prepare(`gestures`)

    DOM.ev(DOM.el(`#settings_gestures_enabled`), `change`, () => {
      App.refresh_gestures()
    })

    DOM.ev(DOM.el(`#settings_gestures_info`), `click`, () => {
      let s = ``
      s += `Hold the middle mouse button and move the mouse in a direction, then release the button to perform an action.`
      App.show_alert(s, undefined, false)
    })

    App.settings_make_menu(`gestures_threshold`, [
      [`Normal`, 10],
      [`Less Sensitive`, 100],
    ], () => {
      App.refresh_gestures()
    })

    let opts = App.get_gesture_options()

    App.settings_make_menu(`gesture_up`, opts.slice(0))
    App.settings_make_menu(`gesture_down`, opts.slice(0))
    App.settings_make_menu(`gesture_left`, opts.slice(0))
    App.settings_make_menu(`gesture_right`, opts.slice(0))
    App.settings_make_menu(`gesture_up_and_down`, opts.slice(0))
    App.settings_make_menu(`gesture_left_and_right`, opts.slice(0))
  }}))
}

App.get_setting_title = (category) => {
  let name

  if (category === `warns`) {
    name = `Warn`
  }
  else if (category === `icons`) {
    name = `Icon`
  }
  else if (category === `gestures`) {
    name = `Gesture`
  }
  else {
    name = App.capitalize(category)
  }

  return `${name} Settings`
}

App.add_settings_switchers = (category) => {
  let buttons = DOM.el(`#window_top_settings_${category}`)
  let title = DOM.el(`.settings_title`, buttons)
  title.textContent = App.get_setting_title(category)

  let prev = DOM.create(`div`, `button arrow_prev`)
  prev.textContent = `<`
  title.before(prev)

  DOM.ev(prev, `click`, () => {
    App.show_prev_settings()
  })

  let next = DOM.create(`div`, `button arrow_next`)
  next.textContent = `>`

  DOM.ev(next, `click`, () => {
    App.show_next_settings()
  })

  DOM.ev(title, `click`, () => {
    App.show_settings_menu(category, title)
  })

  DOM.ev(title.closest(`.window_top`), `wheel`, (e) => {
    App.settings_wheel.call(e)
  })

  title.after(next)
}

App.start_theme_settings = () => {
  function start_color_picker (name) {
    let el = DOM.el(`#settings_${name}_color_picker`)

    App[`${name}_color_picker`] = AColorPicker.createPicker(el, {
      showAlpha: false,
      showHSL: false,
      showHEX: false,
      showRGB: true,
      color: App.get_setting(`${name}_color`)
    })

    App[`${name}_color_picker`].on(`change`, (picker, color) => {
      App.change_color(name, color)
    })
  }

  start_color_picker(`background`)
  start_color_picker(`text`)

  DOM.ev(DOM.el(`#settings_dark_theme`), `click`, () => {
    App.change_theme(`dark`)
  })

  DOM.ev(DOM.el(`#settings_light_theme`), `click`, () => {
    App.change_theme(`light`)
  })

  DOM.ev(DOM.el(`#settings_random_theme`), `click`, () => {
    App.random_theme()
  })

  DOM.ev(DOM.el(`#settings_detect_theme`), `click`, () => {
    App.detect_theme()
  })
}

App.settings_menu_cycle = (el, setting, dir, items) => {
  let cycle = true

  if (setting === `font_size` || setting === `width` || setting === `height`) {
    cycle = false
  }

  let waypoint = false
  items = items.slice(0)

  if (dir === `prev`) {
    items.reverse()
  }

  let s_item

  if (cycle) {
    s_item = items[0]
  }

  for (let item of items) {
    if (item[0] === `--separator--`) {
      continue
    }

    if (waypoint) {
      s_item = item
      break
    }

    if (item[1] === App.get_setting(setting)) {
      waypoint = true
    }
  }

  if (s_item) {
    el.textContent = s_item[0]
    App.set_setting(setting, s_item[1])
  }
}

App.settings_defaults = (category) => {
  for (let setting in App.default_settings) {
    let item = App.default_settings[setting]

    if (item.category === category) {
      App.set_setting(setting, item.value)
    }
  }
}

App.reset_settings = (category) => {
  App.show_confirm(`Reset settings? (${App.capitalize(category)})`, () => {
    App.settings_defaults(category)

    if (category === `order`) {
      App.get_item_order()
      App.make_item_order()
    }
    else if (category === `gestures`) {
      App.refresh_gestures()
    }

    App.apply_theme()
    App.show_window(`settings_${category}`)
  })
}

App.reset_all_settings = () => {
  App.show_confirm(`Reset all settings?`, () => {
    for (let setting in App.default_settings) {
      App.set_setting(setting, App.default_setting(setting))
    }

    App.restart_settings()
  })
}

App.get_font_size_options = () => {
  let opts = []

  for (let i=12; i<=22; i++) {
    opts.push([`${i} px`, i])
  }

  return opts
}

App.get_size_options = () => {
  let opts = []

  for (let i=50; i<=100; i+=5) {
    opts.push([`${i}%`, i])
  }

  return opts
}

App.show_settings = () => {
  if (App.last_settings_window) {
    App.show_window(App.last_settings_window)
  }
  else {
    App.show_window(`settings_basic`)
  }
}

App.show_settings_window = (category) => {
  App.show_window(`settings_${category}`)
}

App.show_prev_settings = () => {
  let index = App.settings_index()
  index -= 1

  if (index < 0) {
    index = App.settings_categories.length - 1
  }

  App.show_settings_window(App.settings_categories[index])
}

App.show_next_settings = () => {
  let index = App.settings_index()
  index += 1

  if (index >= App.settings_categories.length) {
    index = 0
  }

  App.show_settings_window(App.settings_categories[index])
}

App.settings_index = () => {
  return App.settings_categories.indexOf(App.window_mode.replace(`settings_`, ``))
}

App.show_settings_menu = (category, btn) => {
  let items = []

  for (let c of App.settings_categories) {
    items.push({
      text: App.capitalize(c),
      action: () => {
        App.show_settings_window(c)
      }
    })
  }

  items.push({
    separator: true
  })

  items.push({
    text: `Reset`,
    get_items: () => {
      return App.settings_reset_items(category)
    }
  })

  items.push({
    text: `Data`,
    get_items: () => {
      return App.settings_data_items()
    }
  })

  items.push({
    separator: true
  })

  items.push({
    text: `Close`,
    action: () => {
      App.hide_current_window()
    }
  })

  NeedContext.show_on_element(btn, items)
}

App.export_settings = () => {
  App.show_textarea(App.export_string, JSON.stringify(App.settings, null, 2))
}

App.import_settings = () => {
  App.show_input(App.import_string, `Import`, (text) => {
    if (!text) {
      return
    }

    let json

    try {
      json = JSON.parse(text)
    }
    catch (err) {
      App.show_alert(`Invalid JSON`)
      return
    }

    if (json) {
      App.show_confirm(`Use this data?`, () => {
        App.settings = json
        App.check_settings()
        App.stor_save_settings()
        App.restart_settings()
      })
    }
  })
}

App.restart_settings = () => {
  App.get_item_order()
  App.make_item_order()
  App.apply_theme()
  App.refresh_gestures()
  App.show_settings()
}

App.settings_reset_items = (category) => {
  let items = []

  items.push({
    text: `Reset ${App.capitalize(category)}`,
    action: () => {
      App.reset_settings(category)
    }
  })

  items.push({
    text: `Reset All`,
    action: () => {
      App.reset_all_settings()
    }
  })

  return items
}

App.settings_data_items = () => {
  let items = []

  items.push({
    text: `Export`,
    action: () => {
      App.export_settings()
    }
  })

  items.push({
    text: `Import`,
    action: () => {
      App.import_settings()
    }
  })

  return items
}

App.reset_single_setting = (e, action) => {
  let items = []

  items.push({
    text: `Reset`,
    action: action,
  })

  NeedContext.show(e.clientX, e.clientY, items)
  e.preventDefault()
}

App.settings_wheel = App.create_debouncer((e) => {
  let direction = e.deltaY > 0 ? `down` : `up`

  if (direction === `down`) {
    App.show_next_settings()
  }
  else if (direction === `up`) {
    App.show_prev_settings()
  }
}, App.wheel_delay)

App.get_setting = (key) => {
  return App.settings[key].value
}

App.set_setting = (setting, value) => {
  App.settings[setting].value = value
  App.save_settings_debouncer.call()
}

App.default_setting = (setting) => {
  return App.default_settings[setting].value
}

App.save_settings_debouncer = App.create_debouncer(() => {
  App.stor_save_settings()
}, App.settings_save_delay)

App.check_settings = () => {
  let changed = false

  // Fill defaults
  for (let setting in App.default_settings) {
    if (App.settings[setting] === undefined ||
      App.settings[setting].value === undefined ||
      App.settings[setting].version === undefined)
    {
      App.log(`Stor: Adding setting: ${setting}`)
      App.settings[setting] = {}
      App.settings[setting].value = App.default_settings[setting].value
      App.settings[setting].version = App.default_settings[setting].version
      changed = true
    }
  }

  // Remove unused settings
  for (let setting in App.settings) {
    if (App.default_settings[setting] === undefined) {
      App.log(`Stor: Deleting setting: ${setting}`)
      delete App.settings[setting]
      changed = true
    }
    else if (App.settings[setting].version !== App.default_settings[setting].version) {
      App.log(`Stor: Upgrading setting: ${setting}`)
      App.settings[setting].value = App.default_settings[setting].value
      App.settings[setting].version = App.default_settings[setting].version
      changed = true
    }
  }

  if (changed) {
    App.stor_save_settings()
  }
}

App.on_settings = () => {
  return App.window_mode.startsWith(`settings_`)
}

App.get_gesture_options = () => {
  let items = [
    [`Do Nothing`, `none`],
    [`--separator--`],
  ]

  function add_separator() {
    items.push([`--separator--`])
  }

  for (let cmd of App.ordered_commands) {
    items.push(cmd)

    if (cmd[1] === `scroll_down`) {
      add_separator()
    }
    else if (cmd[1] === `close_window`) {
      add_separator()
    }
    else if (cmd[1] === `go_to_playing`) {
      add_separator()
    }
    else if (cmd[1] === `close_tab`) {
      add_separator()
    }
    else if (cmd[1] === `show_videos`) {
      add_separator()
    }
    else if (cmd[1] === `random_theme`) {
      add_separator()
    }
  }

  return items
}

App.tab_warn_opts = [
  [`Always`, `always`],
  [`Special`, `special`],
  [`Never`, `never`],
]