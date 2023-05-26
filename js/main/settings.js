App.default_settings = {
  tabs_index: {value: 0, category: `order`},
  history_index: {value: 1, category: `order`},
  bookmarks_index: {value: 2, category: `order`},
  closed_index: {value: 3, category: `order`},
  stars_index: {value: 4, category: `order`},

  text_mode: {value: `title`, category: `basic`},
  item_height: {value: `normal`, category: `basic`},
  width: {value: 70, category: `basic`},
  height: {value: 80, category: `basic`},
  font: {value: `sans-serif`, category: `basic`},
  font_size: {value: 16, category: `basic`},

  background_color: {value: `rgb(70, 76, 94)`, category: `theme`},
  text_color: {value: `rgb(218, 219, 223)`, category: `theme`},
  background: {value: 1, category: `theme`},
  custom_background: {value: ``, category: `theme`},

  pin_icon: {value: `+`, category: `icons`},
  normal_icon: {value: ``, category: `icons`},
  playing_icon: {value: `🔊`, category: `icons`},
  muted_icon: {value: `🔇`, category: `icons`},
  suspended_icon: {value: `💤`, category: `icons`},

  media_viewer_on_tabs: {value: false, category: `media`},
  media_viewer_on_history: {value: true, category: `media`},
  media_viewer_on_bookmarks: {value: true, category: `media`},
  media_viewer_on_closed: {value: true, category: `media`},
  media_viewer_on_stars: {value: true, category: `media`},

  warn_on_close: {value: true, category: `warns`},
  warn_on_suspend: {value: true, category: `warns`},
  warn_on_duplicates: {value: true, category: `warns`},
  warn_on_clean: {value: true, category: `warns`},
  warn_on_star: {value: true, category: `warns`},
  warn_on_unstar: {value: true, category: `warns`},
  warn_on_launch: {value: true, category: `warns`},

  switch_to_tabs: {value: true, category: `More`},
  hover_tooltips: {value: true, category: `More`},
  mouse_gestures: {value: true, category: `More`},
  clear_filter: {value: true, category: `More`},
  show_icons: {value: true, category: `More`},
  show_footer: {value: true, category: `More`},
  show_pinline: {value: true, category: `More`},
  highlight_effect: {value: `rotate`, category: `More`},
  lock_drag: {value: false, category: `More`},
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
    el.checked = App.settings[setting]

    DOM.ev(el, `change`, () => {
      App.settings[setting] = el.checked
      App.stor_save_settings()
      App.settings_do_action(action)
    })

    DOM.ev(el, `contextmenu`, (e) => {
      App.reset_single_setting(e, () => {
        let value = App.default_settings[setting].value
        App.settings[setting] = value
        el.checked = value
        App.stor_save_settings()
        App.settings_do_action(action)
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

    el.value = App.settings[setting]

    DOM.ev(el, `blur`, () => {
      el.value = el.value.trim()
      App.settings[setting] = el.value
      App.stor_save_settings()
      App.settings_do_action(action)
    })

    DOM.ev(el, `contextmenu`, (e) => {
      App.reset_single_setting(e, () => {
        let value = App.default_settings[setting].value
        App.settings[setting] = value
        el.value = value
        App.stor_save_settings()
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
      let selected = App.settings[setting] === o[1]

      items.push({
        text: o[0],
        action: () => {
          el.textContent = o[0]
          App.settings[setting] = o[1]
          App.stor_save_settings()
          action()
        },
        selected: selected
      })
    }

    NeedContext.show_on_element(el, items, true, el.clientHeight)
  })

  DOM.ev(el, `contextmenu`, (e) => {
    App.reset_single_setting(e, () => {
      let value = App.default_settings[setting].value
      App.settings[setting] = value

      for (let o of opts) {
        if (o[1] === value) {
          el.textContent = o[0]
          break
        }
      }

      App.stor_save_settings()
      action()
    })
  })

  for (let o of opts) {
    if (App.settings[setting] === o[1]) {
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
    App.apply_theme()
  }

  function next_fn () {
    App.settings_menu_cycle(el, setting, `next`, opts)
    App.apply_theme()
  }

  DOM.ev(prev, `click`, prev_fn)
  DOM.ev(next, `click`, next_fn)

  buttons.append(prev)
  buttons.append(next)
  el.after(buttons)
  prev.after(el)
}

App.setup_settings = () => {
  App.settings_categories = [`basic`, `theme`, `icons`, `media`, `warns`, `order`, `more`]

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
    ])
  }}))
}

App.add_settings_switchers = (category) => {
  let buttons = DOM.el(`#window_top_settings_${category}`)
  let title = DOM.el(`.settings_title`, buttons)
  let close = DOM.create(`div`, `button settings_close_button`)
  close.textContent = `Close`

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

  DOM.ev(close, `click`, () => {
    App.hide_current_window()
  })

  title.after(close)
  close.after(next)
}

App.start_theme_settings = () => {
  function start_color_picker (name) {
    let el = DOM.el(`#settings_${name}_color_picker`)

    App[`${name}_color_picker`] = AColorPicker.createPicker(el, {
      showAlpha: false,
      showHSL: false,
      showHEX: false,
      showRGB: true,
      color: App.settings[`${name}_color`]
    })

    App[`${name}_color_picker`].on(`change`, (picker, color) => {
      App.change_color(name, color)
    })
  }

  start_color_picker(`background`)
  start_color_picker(`text`)

  DOM.ev(DOM.el(`#settings_random_theme`), `click`, () => {
    App.random_theme()
  })

  DOM.ev(DOM.el(`#settings_detect_theme`), `click`, () => {
    App.detect_theme()
  })

  let imgs = App.get_background_options()

  App.settings_make_menu(`background`, imgs, () => {
    App.apply_theme()
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

App.reset_settings = (category) => {
  App.show_confirm(`Reset settings? (${App.capitalize(category)})`, () => {
    for (let key in App.default_settings) {
      let item = App.default_settings[key]

      if (item.category === category) {
        App.settings[key] = item.value
      }
    }

    if (category === `order`) {
      App.get_item_order()
      App.make_item_order()
    }

    App.stor_save_settings()
    App.apply_theme()
    App.show_window(`settings_${category}`)
  })
}

App.reset_all_settings = (type) => {
  App.show_confirm(`Reset all settings?`, () => {
    for (let key in App.default_settings) {
      App.settings[key] = App.default_settings[key].value
    }

    App.restart_settings()
  })
}

App.get_background_options = () => {
  let opts = []

  for (let i=0; i<=App.num_background_images; i++) {
    opts.push([App.get_background_label(i), i])
  }

  return opts
}

App.get_background_label = (n) => {
  let ns = App.fillpad(n.toString(), 2, 0)
  return `BG ${ns}`
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

  NeedContext.show_on_element(btn, items)
}

App.export_settings = () => {
  App.show_textarea(`Copy this to import it later`, JSON.stringify(App.settings, null, 2))
}

App.import_settings = () => {
  App.show_input(`Paste the data text here`, `Import`, (text) => {
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
        App.restart_settings()
      })
    }
  })
}

App.restart_settings = () => {
  App.get_item_order()
  App.make_item_order()
  App.apply_theme()
  App.stor_save_settings()
  App.show_window(`settings_basic`)
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

App.reset_single_setting = (e, action) => {
  let items = []

  items.push({
    text: `Reset`,
    action: action,
  })

  NeedContext.show(e.clientX, e.clientY, items)
  e.preventDefault()
}