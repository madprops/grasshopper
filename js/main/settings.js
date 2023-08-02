App.build_default_settings = () => {
  let obj = {}

  let category = `general`
  obj.text_mode = {value: `title`, category: category, version: 1}
  obj.item_height = {value: `normal`, category: category, version: 1}
  obj.font = {value: `sans-serif`, category: category, version: 1}
  obj.font_size = {value: 16, category: category, version: 1}
  obj.fetch_favicons = {value: true, category: category, version: 1}
  obj.width = {value: 75, category: category, version: 1}
  obj.height = {value: 85, category: category, version: 1}
  obj.tabs_index = {value: 0, category: category, version: 1}
  obj.history_index = {value: 1, category: category, version: 1}
  obj.bookmarks_index = {value: 2, category: category, version: 1}
  obj.closed_index = {value: 3, category: category, version: 1}
  obj.custom_filters = {value: [`search`, `watch`, `wiki`], category: category, version: 1}
  obj.bookmarks_folder = {value: `Grasshopper`, category: category, version: 1}
  obj.item_border = {value: `none`, category: category, version: 2}

  category = `theme`
  obj.background_color = {value: `rgb(45, 45, 55)`, category: category, version: 1}
  obj.text_color = {value: `rgb(233, 233, 233)`, category: category, version: 1}
  obj.border_color = {value: `rgb(33, 140, 77)`, category: category, version: 1}
  obj.background_image = {value: `/img/background.jpg`, category: category, version: 1}
  obj.background_effect = {value: `none`, category: category, version: 1}
  obj.background_tiles = {value: `none`, category: category, version: 1}

  category = `icons`
  obj.pin_icon = {value: `+`, category: category, version: 1}
  obj.normal_icon = {value: ``, category: category, version: 1}
  obj.playing_icon = {value: `🔊`, category: category, version: 1}
  obj.muted_icon = {value: `🔇`, category: category, version: 1}
  obj.unloaded_icon = {value: `💤`, category: category, version: 1}
  obj.close_icon = {value: `x`, category: category, version: 1}
  obj.open_icon = {value: `🚀`, category: category, version: 1}
  obj.pick_icon = {value: `🎯`, category: category, version: 1}
  obj.active_icon = {value: `👁`, category: category, version: 1}
  obj.highlight_icon = {value: `☀️`, category: category, version: 1}

  category = `warns`
  obj.warn_on_close_tabs = {value: `special`, category: category, version: 1}
  obj.warn_on_unload_tabs = {value: `special`, category: category, version: 1}
  obj.warn_on_duplicate_tabs = {value: true, category: category, version: 1}
  obj.warn_on_close_duplicate_tabs = {value: true, category: category, version: 1}
  obj.warn_on_close_normal_tabs = {value: true, category: category, version: 1}
  obj.warn_on_open = {value: true, category: category, version: 1}
  obj.warn_on_remove_profiles = {value: true, category: category, version: 1}
  obj.warn_on_bookmark = {value: true, category: category, version: 1}

  category = `media`
  obj.view_image = {value: `icon`, category: category, version: 1}
  obj.view_video = {value: `icon`, category: category, version: 1}
  obj.view_audio = {value: `icon`, category: category, version: 1}
  obj.image_icon = {value: `🖼️`, category: category, version: 1}
  obj.video_icon = {value: `▶️`, category: category, version: 1}
  obj.audio_icon = {value: `🎵`, category: category, version: 1}

  category = `mouse`
  obj.gestures_enabled = {value: true, category: category, version: 1}
  obj.gestures_threshold = {value: 10, category: category, version: 1}
  obj.gesture_up = {value: `go_to_top`, category: category, version: 1}
  obj.gesture_down = {value: `go_to_bottom`, category: category, version: 1}
  obj.gesture_left = {value: `prev_mode`, category: category, version: 1}
  obj.gesture_right = {value: `next_mode`, category: category, version: 1}
  obj.gesture_up_and_down = {value: `show_all`, category: category, version: 1}
  obj.gesture_left_and_right = {value: `filter_domain`, category: category, version: 1}
  obj.middle_click_main_menu = {value: `show_main`, category: category, version: 1}
  obj.middle_click_filter_menu = {value: `show_all`, category: category, version: 1}
  obj.middle_click_back_button = {value: `browser_back`, category: category, version: 1}
  obj.middle_click_actions_menu = {value: `browser_reload`, category: category, version: 1}
  obj.middle_click_footer = {value: `copy_item_url`, category: category, version: 1}
  obj.middle_click_pick_button = {value: `filter_domain`, category: category, version: 1}
  obj.middle_click_close_button = {value: `unload_tabs`, category: category, version: 1}
  obj.middle_click_open_button = {value: `open_items`, category: category, version: 1}
  obj.middle_click_pinline = {value: `close_normal_tabs`, category: category, version: 1}

  category = `more`
  obj.switch_to_tabs = {value: true, category: category, version: 1}
  obj.close_duplicate_pins = {value: true, category: category, version: 1}
  obj.close_unloaded_tabs = {value: true, category: category, version: 1}
  obj.single_new_tab = {value: true, category: category, version: 1}
  obj.auto_restore = {value: true, category: category, version: 1}
  obj.close_on_focus = {value: true, category: category, version: 1}
  obj.close_on_open = {value: true, category: category, version: 1}
  obj.case_insensitive_filter = {value: true, category: category, version: 1}
  obj.lock_drag = {value: false, category: category, version: 1}
  obj.mute_click = {value: true, category: category, version: 1}
  obj.double_click_new_tab = {value: true, category: category, version: 1}

  category = `show`
  obj.show_scrollbars = {value: true, category: category, version: 1}
  obj.show_tooltips = {value: true, category: category, version: 1}
  obj.show_icons = {value: true, category: category, version: 1}
  obj.show_pinline = {value: true, category: category, version: 1}
  obj.show_scroller = {value: true, category: category, version: 1}
  obj.show_footer = {value: true, category: category, version: 1}

  App.default_settings = obj
}

App.make_mode_order = () => {
  let mode_order = DOM.el(`#settings_mode_order`)
  mode_order.innerHTML = ``

  for (let m of App.mode_order) {
    let row = DOM.create(`div`, `mode_order_row`)
    row.dataset.mode = m

    let up = DOM.create(`div`, `button mode_order_button`)
    up.textContent = `Up`
    row.append(up)

    DOM.ev(up, `click`, () => {
      App.mode_order_up(row)
    })

    let text = DOM.create(`div`, `mode_order_item_text`)
    text.textContent = App.get_mode_name(m)
    row.append(text)

    let down = DOM.create(`div`, `button mode_order_button`)
    down.textContent = `Down`
    row.append(down)

    DOM.ev(down, `click`, () => {
      App.mode_order_down(row)
    })

    mode_order.append(row)
  }
}

App.settings_do_action = (what) => {
  if (what === `theme`) {
    App.apply_theme()
  }
}

App.get_settings_label = (setting) => {
  let item = DOM.el(`#settings_${setting}`)
  let container = item.closest(`.settings_item`)
  let label = DOM.el(`.settings_label`, container)
  return label
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

    DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
      App.reset_single_setting(e, () => {
        App.set_default_setting(setting)
        el.checked = App.get_setting(setting)
        App.settings_do_action(action)
      })
    })
  }
}

App.settings_setup_text = (container) => {
  let items = DOM.els(`.settings_text`, container)
  items.push(...DOM.els(`.settings_textarea`, container))

  for (let item of items) {
    let setting = item.dataset.setting
    let action = item.dataset.action
    let el = DOM.el(`#settings_${setting}`)
    let is_textarea = item.classList.contains(`settings_textarea`)
    let value = App.get_setting(setting)

    if (is_textarea) {
      value = App.get_setting(setting).join(`\n`)
    }

    el.value = value

    DOM.ev(el, `blur`, () => {
      let value = el.value.trim()

      if (is_textarea) {
        let cleaned = App.single_linebreak(value)
        el.value = cleaned
        value = cleaned.split(`\n`).filter(x => x !== ``).map(x => x.trim())
      }
      else {
        el.value = value
      }

      App.set_setting(setting, value)
      App.settings_do_action(action)
    })

    DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
      App.reset_single_setting(e, () => {
        App.set_default_setting(setting)
        let value = App.get_setting(setting)

        if (is_textarea) {
          el.value = value.join(`\n`)
        }
        else {
          el.value = value
        }

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
      if (o[0] === App.separator_string) {
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

  DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
    App.reset_single_setting(e, () => {
      App.set_default_setting(setting)
      let value = App.get_setting(setting)

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

App.add_settings_filter = (category) => {
  let container = DOM.el(`#settings_${category}_container`)
  let filter = DOM.create(`input`, `settings_filter text small_filter`, `settings_${category}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  filter.placeholder = `Filter`
  container.prepend(filter)
}

App.filter_settings_debouncer = App.create_debouncer(() => {
  App.do_filter_settings()
}, App.filter_delay_2)

App.filter_settings = () => {
  App.filter_settings_debouncer.call()
}

App.do_filter_settings = () => {
  App.filter_settings_debouncer.cancel()
  App.do_filter_2(`settings_${App.settings_category}`)
}

App.clear_settings_filter = () => {
  if (App.settings_filter_focused()) {
    let mode = `settings_${App.settings_category}`

    if (App.filter_has_value(mode)) {
      App.set_filter(mode, ``)
    }
    else {
      App.hide_window()
    }
  }
}

App.settings_filter_focused = () => {
  return document.activeElement.classList.contains(`settings_filter`)
}

App.setup_settings = () => {
  App.settings_categories = [`general`, `theme`, `icons`, `media`, `show`, `mouse`, `warns`, `more`]

  let common = {
    persistent: false,
    colored_top: true,
    after_show: () => {
      DOM.el(`#settings_${App.settings_category}_filter`).focus()
    },
    on_hide: () => {
      App.apply_theme()
      App.show_first_window()
    },
  }

  function prepare (category) {
    let container = DOM.el(`#settings_${category}_container`)
    App.settings_setup_checkboxes(container)
    App.settings_setup_text(container)
    App.add_settings_switchers(category)
    App.add_settings_filter(category)
    container.classList.add(`filter_container`)

    for (let el of DOM.els(`.settings_item`, container)) {
      el.classList.add(`filter_item`)
    }

    for (let el of DOM.els(`.settings_label`, container)) {
      el.classList.add(`filter_text`)
      el.classList.add(`action`)
    }
  }

  App.create_window(Object.assign({}, common, {id: `settings_general`, setup: () => {
    prepare(`general`)

    App.settings_make_menu(`text_mode`, [
      [`Title`, `title`],
      [`URL`, `url`],
      [`Title / URL`, `title_url`],
      [`URL / Title`, `url_title`],
    ])

    App.settings_make_menu(`font`, [
      [`Sans`, `sans-serif`],
      [`Serif`, `serif`],
      [`Mono`, `monospace`],
      [`Cursive`, `cursive`],
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
      [`Huge`, `huge`],
    ])

    App.settings_make_menu(`item_border`, [
      [`None`, `none`],
      [`Normal`, `normal`],
      [`Bigger`, `bigger`],
    ])

    App.settings_make_menu(`width`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.settings_make_menu(`height`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.make_mode_order()

    DOM.evs(App.get_settings_label(`mode_order`), [`click`, `contextmenu`], (e) => {
      App.reset_single_setting(e, () => {
        App.set_default_setting(`tabs_index`)
        App.set_default_setting(`history_index`)
        App.set_default_setting(`bookmarks_index`)
        App.set_default_setting(`closed_index`)
        App.get_mode_order()
        App.make_mode_order()
      })
    })
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_theme`, setup: () => {
    App.start_theme_settings()
    prepare(`theme`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_icons`, setup: () => {
    prepare(`icons`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_warns`, setup: () => {
    prepare(`warns`)
    App.settings_make_menu(`warn_on_close_tabs`, App.tab_warn_opts)
    App.settings_make_menu(`warn_on_unload_tabs`, App.tab_warn_opts)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_more`, setup: () => {
    prepare(`more`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_media`, setup: () => {
    prepare(`media`)

    let opts = [
      [`Never`, `never`],
      [`By Clicking Icon`, `icon`],
      [`By Clicking Item`, `item`],
    ]

    App.settings_make_menu(`view_image`, opts.slice(0))
    App.settings_make_menu(`view_video`, opts.slice(0))
    App.settings_make_menu(`view_audio`, opts.slice(0))
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_show`, setup: () => {
    prepare(`show`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_mouse`, setup: () => {
    prepare(`mouse`)

    DOM.ev(DOM.el(`#settings_gestures_enabled`), `change`, () => {
      App.refresh_gestures()
    })

    App.settings_make_menu(`gestures_threshold`, [
      [`Normal`, 10],
      [`Less Sensitive`, 100],
    ], () => {
      App.refresh_gestures()
    })

    let opts = App.settings_commands()

    for (let gesture of App.gestures) {
      App.settings_make_menu(`gesture_${gesture}`, opts.slice(0))
    }

    App.settings_make_menu(`middle_click_main_menu`, opts.slice(0))
    App.settings_make_menu(`middle_click_filter_menu`, opts.slice(0))
    App.settings_make_menu(`middle_click_back_button`, opts.slice(0))
    App.settings_make_menu(`middle_click_actions_menu`, opts.slice(0))
    App.settings_make_menu(`middle_click_footer`, opts.slice(0))
    App.settings_make_menu(`middle_click_pick_button`, opts.slice(0))
    App.settings_make_menu(`middle_click_close_button`, opts.slice(0))
    App.settings_make_menu(`middle_click_open_button`, opts.slice(0))
    App.settings_make_menu(`middle_click_pinline`, opts.slice(0))
  }}))

  window.addEventListener(`storage`, (e) => {
    if (e.key === App.stor_settings_name) {
      App.log(`Settings changed in another window`)
      App.stor_get_settings()
      App.restart_settings(`sync`)
    }
  })
}

App.get_setting_title = (category) => {
  let name

  if (category === `warns`) {
    name = `Warn`
  }
  else if (category === `icons`) {
    name = `Icon`
  }
  else {
    name = App.capitalize(category)
  }

  return `${name} Settings`
}

App.add_settings_switchers = (category) => {
  let buttons = DOM.el(`#window_top_settings_${category}`)
  let title = DOM.el(`.settings_title`, buttons)
  title.id = `settings_title_${category}`
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
    App.show_settings_menu()
  })

  DOM.ev(title, `contextmenu`, (e) => {
    App.show_settings_menu()
    e.preventDefault()
  })

  DOM.ev(title, `auxclick`, (e) => {
    if (e.button === 1) {
      App.hide_window()
    }
  })

  DOM.ev(title.closest(`.window_top`), `wheel`, (e) => {
    App.settings_wheel.call(e)
  })

  title.after(next)
}

App.start_theme_settings = () => {
  function start_color_picker (name) {
    let el = DOM.el(`#settings_${name}_color`)
    let setting = `${name}_color`

    App[setting] = AColorPicker.createPicker(el, {
      showAlpha: false,
      showHSL: false,
      showHEX: false,
      showRGB: true,
      color: App.get_setting(setting)
    })

    App[setting].on(`change`, (picker, color) => {
      App.set_setting(setting, color)
      App.apply_theme()
    })

    DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
      App.reset_single_setting(e, () => {
        App.set_default_setting(setting)
        App[setting].setColor(App.get_setting(setting))
      })
    })
  }

  start_color_picker(`background`)
  start_color_picker(`text`)

  App.settings_make_menu(`background_effect`, [
    [`None`, `none`],
    [`Gray`, `grayscale`],
    [`Invert`, `invert`],
    [`Rotate 1`, `rotate_1`],
    [`Rotate 2`, `rotate_2`],
    [`Rotate 3`, `rotate_3`],
    [`Blur`, `blur`],
  ], () => {
    App.apply_theme()
  })

  App.settings_make_menu(`background_tiles`, [
    [`None`, `none`],
    [`50px`, `50px`],
    [`100px`, `100px`],
    [`150px`, `150px`],
    [`200px`, `200px`],
    [`250px`, `250px`],
    [`300px`, `300px`],
    [`350px`, `350px`],
    [`400px`, `400px`],
    [`450px`, `450px`],
    [`500px`, `500px`],
  ], () => {
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
    if (item[0] === App.separator_string) {
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

App.settings_default_category = (category) => {
  for (let setting in App.default_settings) {
    let item = App.default_settings[setting]

    if (item.category === category) {
      App.set_default_setting(setting)
    }
  }
}

App.set_default_setting = (setting) => {
  App.set_setting(setting, App.default_setting_string)
}

App.reset_settings = (category) => {
  App.show_confirm(`Reset settings? (${App.capitalize(category)})`, () => {
    App.settings_default_category(category)

    if (category === `general`) {
      App.get_mode_order()
      App.make_mode_order()
    }
    else if (category === `mouse`) {
      App.refresh_gestures()
    }

    App.apply_theme()
    App.show_window(`settings_${category}`)
  })
}

App.reset_all_settings = () => {
  App.show_confirm(`Reset all settings?`, () => {
    for (let setting in App.default_settings) {
      App.set_default_setting(setting)
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
  App.show_window(`settings_general`)
}

App.show_settings_window = (category) => {
  App.settings_category = category
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
  return App.settings_categories.indexOf(App.settings_category)
}

App.show_settings_menu = () => {
  let category = App.settings_category
  let btn = DOM.el(`#settings_title_${category}`)

  let items = []

  items.push({
    text: `Jump`,
    get_items: () => {
      return App.settings_menu_items()
    }
  })

  items.push({
    text: `Reset`,
    action: () => {
      App.reset_settings(category)
    }
  })

  items.push({
    text: `Data`,
    get_items: () => {
      return App.settings_data_items()
    }
  })

  items.push({
    text: `Info`,
    get_items: () => {
      return App.settings_info()
    }
  })

  items.push({
    text: `Close`,
    action: () => {
      App.hide_window()
    }
  })

  NeedContext.show_on_element(btn, items)
}

App.export_settings = () => {
  App.export_data(App.settings)
}

App.import_settings = () => {
  App.import_data((json) => {
    App.settings = json
    App.check_settings()
    App.stor_save_settings()
    App.restart_settings()
  })
}

App.restart_settings = (type = `normal`) => {
  App.get_mode_order()
  App.make_mode_order()
  App.apply_theme()
  App.refresh_gestures()

  if (App.on_item_window() || type === `sync`) {
    App.show_mode(App.active_mode)
  }
  else {
    App.show_settings()
  }
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

  items.push({
    text: `Reset`,
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

App.settings_wheel = App.create_debouncer((e, direction) => {
  if (!direction) {
    direction = App.wheel_direction(e)
  }

  if (direction === `down`) {
    App.show_next_settings()
  }
  else if (direction === `up`) {
    App.show_prev_settings()
  }
}, App.wheel_delay)

App.get_setting = (setting) => {
  let value = App.settings[setting].value

  if (value === App.default_setting_string) {
    if (value === App.default_setting_string) {
      value = App.get_default_setting(setting)
    }
  }

  return value
}

App.set_setting = (setting, value) => {
  App.settings[setting].value = value
  App.save_settings_debouncer.call()
}

App.get_default_setting = (setting) => {
  return App.default_settings[setting].value
}

App.save_settings_debouncer = App.create_debouncer(() => {
  App.stor_save_settings()
}, App.settings_save_delay)

App.check_settings = () => {
  let changed = false

  function set_default (setting) {
    App.settings[setting].value = App.default_setting_string
    App.settings[setting].version = App.default_settings[setting].version
  }

  for (let setting in App.default_settings) {
    // Fill defaults
    if (App.settings[setting] === undefined ||
      App.settings[setting].value === undefined ||
      App.settings[setting].version === undefined)
    {
      App.log(`Stor: Adding setting: ${setting}`)
      App.settings[setting] = {}
      set_default(setting)
      changed = true
    }
  }

  for (let setting in App.settings) {
    // Remove unused settings
    if (App.default_settings[setting] === undefined) {
      App.log(`Stor: Deleting setting: ${setting}`)
      delete App.settings[setting]
      changed = true
    }
    // Check new version
    else if (App.settings[setting].version !== App.default_settings[setting].version) {
      App.log(`Stor: Upgrading setting: ${setting}`)
      set_default(setting)
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

App.settings_commands = () => {
  let items = [
    [`Do Nothing`, `none`],
    [App.separator_string],
  ]

  for (let cmd of App.commands) {
    if (cmd.name === App.separator_string) {
      items.push([App.separator_string])
    }
    else {
      items.push([cmd.name, cmd.cmd])
    }
  }

  return items
}

App.tab_warn_opts = [
  [`Never`, `never`],
  [`Always`, `always`],
  [`Special`, `special`],
]

App.on_settings_window = (mode) => {
  return mode.startsWith(`settings_`)
}

App.settings_menu_items = (action = `normal`) => {
  let items = []

  for (let c of App.settings_categories) {
    let selected = c === App.settings_category

    items.push({
      text: App.capitalize(c),
      action: () => {
        App.show_settings_window(c)
      },
      selected: selected,
    })
  }

  if (action === `main_menu`) {
    items.push({separator: true})

    items.push({
      text: `Data`,
      get_items: () => {
        return App.settings_data_items()
      },
    })
  }

  return items
}

App.change_background = (url) => {
  App.set_setting(`background_image`, url)
  App.set_setting(`background_effect`, `none`)
  App.set_setting(`background_tiles`, `none`)
  App.apply_theme()
}

App.settings_info = () => {
  let s = `There are multiple setting sections.`
  s += ` These are saved locally and not synced.`
  s += ` To backup or move this data use the Export/Import feature in the menu.`
  App.show_alert_2(s)
}