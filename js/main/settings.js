App.default_settings = {
  text_mode: {value: `title`, category: `basic`},

  tabs_index: {value: 0, category: `basic`},
  history_index: {value: 1, category: `basic`},
  bookmarks_index: {value: 2, category: `basic`},
  closed_index: {value: 3, category: `basic`},
  stars_index: {value: 4, category: `basic`},

  lock_drag: {value: false, category: `basic`},
  switch_to_tabs: {value: true, category: `basic`},
  hover_tooltips: {value: true, category: `basic`},
  mouse_gestures: {value: true, category: `basic`},
  clear_filter: {value: true, category: `basic`},

  width: {value: 70, category: `basic`},
  height: {value: 80, category: `basic`},

  font: {value: `sans-serif`, category: `basic`},
  font_size: {value: 16, category: `basic`},

  background_color: {value: `rgb(43, 42, 51)`, category: `theme`},
  text_color: {value: `rgb(213, 212, 214)`, category: `theme`},
  background_image: {value: `1`, category: `theme`},
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
  }
}

App.settings_make_menu = (id, opts, action = () => {}) => {
  let el = DOM.el(`#settings_${id}`)

  DOM.ev(el, `click`, () => {
    let items = []

    for (let o of opts) {
      let selected = App.settings[id] === o[1]

      items.push({
        text: o[0],
        action: () => {
          el.textContent = o[0]
          App.settings[id] = o[1]
          App.stor_save_settings()
          action()
        },
        selected: selected
      })
    }

    NeedContext.show_on_element(el, items, true, el.clientHeight)
  })

  for (let o of opts) {
    if (App.settings[id] === o[1]) {
      el.textContent = o[0]
    }
  }

  let buttons = DOM.create(`div`, `flex_row_center gap_1`)
  let prev = DOM.create(`div`, `button`)
  prev.textContent = `<`
  let next = DOM.create(`div`, `button`)
  next.textContent = `>`

  function prev_fn () {
    App.settings_menu_cycle(el, id, `prev`, opts)
    App.apply_theme()
  }

  function next_fn () {
    App.settings_menu_cycle(el, id, `next`, opts)
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
  App.settings_order = [`settings_basic`, `settings_theme`, `settings_icons`, `settings_media`]

  App.create_window({id: `settings_basic`, setup: () => {
    let container = DOM.el(`#settings_basic_container`)
    App.settings_setup_checkboxes(container)
    App.settings_make_menu(`text_mode`, [[`Title`, `title`], [`URL`, `url`]])

    App.settings_make_menu(`width`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.settings_make_menu(`height`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.make_item_order()

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

    DOM.ev(DOM.el(`#settings_defaults_basic`), `click`, () => {
      App.restore_default_settings(`basic`)
    })

    App.add_settings_switchers(`basic`)
  }, persistent: false, colored_top: true})

  App.create_window({id: `settings_theme`, setup: () => {
    App.start_theme_settings()
    App.add_settings_switchers(`theme`)
    let container = DOM.el(`#settings_theme_container`)
    App.settings_setup_text(container)
  }, persistent: false, colored_top: true})

  App.create_window({id: `settings_icons`, setup: () => {
    let container = DOM.el(`#settings_icons_container`)
    App.settings_setup_text(container)

    DOM.ev(DOM.el(`#settings_default_icons`), `click`, () => {
      App.restore_default_settings(`icons`)
    })

    App.add_settings_switchers(`icons`)
  }, persistent: false, colored_top: true})

  App.create_window({id: `settings_media`, setup: () => {
    let container = DOM.el(`#settings_media_container`)
    App.settings_setup_checkboxes(container)

    DOM.ev(DOM.el(`#settings_default_media`), `click`, () => {
      App.restore_default_settings(`media`)
    })

    App.add_settings_switchers(`media`)
  }, persistent: false, colored_top: true})
}

App.add_settings_switchers = (category) => {
  let win = DOM.el(`#window_settings_${category}`)
  let title = DOM.el(`.settings_title`, win)
  let close = DOM.create(`div`, `button settings_close_button`)

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
    App.show_settings_menu(title)
  })

  DOM.ev(close, `click`, () => {
    App.hide_current_window()
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
      color: App.settings[`${name}_color`]
    })

    App[`${name}_color_picker`].on(`change`, (picker, color) => {
      App.change_color(name, color)
    })
  }

  start_color_picker(`background`)
  start_color_picker(`text`)

  DOM.ev(DOM.el(`#settings_dark_theme`), `click`, () => {
    App.random_theme(`dark`)
  })

  DOM.ev(DOM.el(`#settings_light_theme`), `click`, () => {
    App.random_theme(`light`)
  })

  DOM.ev(DOM.el(`#settings_detect_theme`), `click`, () => {
    App.detect_theme()
  })

  DOM.ev(DOM.el(`#settings_default_theme`), `click`, () => {
    App.restore_default_settings(`theme`)
  })

  let imgs = App.get_background_image_options()

  App.settings_make_menu(`background_image`, imgs, () => {
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

App.restore_default_settings = (type) => {
  App.show_confirm(`Restore default settings? (${type})`, () => {
    for (let key in App.default_settings) {
      let item = App.default_settings[key]

      if (item.category === type) {
        App.settings[key] = item.value
      }
    }

    if (type === `basic`) {
      App.get_item_order()
      App.make_item_order()
    }

    App.stor_save_settings()
    App.apply_theme()
    App.show_window(`settings_${type}`)
  })
}

App.restore_all_default_settings = (type) => {
  App.show_confirm(`Restore all default settings?`, () => {
    for (let key in App.default_settings) {
      App.settings[key] = App.default_settings[key].value
    }

    App.restart_settings()
  })
}

App.get_background_image_options = () => {
  let opts = [[`None`, `none`]]

  for (let i=1; i<=App.num_background_images; i++) {
    let ii = i.toString()
    let ns = App.fillpad(ii, 2, 0)
    opts.push([`BG ${ns}`, ii])
  }

  return opts
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

App.show_prev_settings = () => {
  let index = App.settings_order.indexOf(App.window_mode)
  index -= 1

  if (index < 0) {
    index = App.settings_order.length - 1
  }

  App.show_window(App.settings_order[index])
}

App.show_next_settings = () => {
  let index = App.settings_order.indexOf(App.window_mode)
  index += 1

  if (index >= App.settings_order.length) {
    index = 0
  }

  App.show_window(App.settings_order[index])
}

App.show_settings_menu = (btn) => {
  let items = []

  items.push({
    text: `Basic`,
    action: () => {
      App.show_window(`settings_basic`)
    }
  })

  items.push({
    text: `Theme`,
    action: () => {
      App.show_window(`settings_theme`)
    }
  })

  items.push({
    text: `Icons`,
    action: () => {
      App.show_window(`settings_icons`)
    }
  })

  items.push({
    text: `Media`,
    action: () => {
      App.show_window(`settings_media`)
    }
  })

  items.push({
    separator: true
  })

  items.push({
    text: `Defaults`,
    action: () => {
      App.restore_all_default_settings()
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