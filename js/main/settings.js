App.settings_do_actions = (actions) => {
  if (!App.on_settings()) {
    return
  }

  for (let action of actions) {
    if (action === `theme`) {
      App.apply_theme()
    }
    else if (action === `commands`) {
      App.setup_commands()
      App.build_setting_cmds()
      App.fill_palette()
    }
    else if (action === `filters`) {
      App.start_filter_debouncers()
    }
    else if (action === `gestures`) {
      App.refresh_gestures()
    }
    else if (action === `sort_settings`) {
      App.sort_catprops()
    }
  }
}

App.get_settings_label = (setting) => {
  let item = DOM.el(`#settings_${setting}`)
  let container = DOM.parent(item, [`.settings_item`])
  let label = DOM.el(`.settings_label`, container)
  return label
}

App.settings_setup_labels = (category) => {
  function proc(item, btns) {
    let bc = DOM.create(`div`, `flex_row_center gap_1`)

    for (let btn of btns) {
      let c = DOM.create(`div`, `flex_row_center gap_1`)
      let d = DOM.create(`div`)
      d.textContent = `|`
      let a = DOM.create(`div`, `doubleline`)
      a.id = btn[0]
      a.textContent = btn[1]
      c.append(d)
      c.append(a)
      bc.append(c)
    }

    item.before(bc)
    bc.prepend(item)
  }

  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if ((props.category === category) && props.btns) {
      let btns = []

      if (props.btns.includes(`pick`)) {
        btns.push([`settings_${key}_pick`, `Pick`])
      }

      if (props.btns.includes(`upload`)) {
        btns.push([`settings_${key}_upload`, `Upload`])
      }

      if (btns.length) {
        proc(DOM.el(`#settings_label_${key}`), btns)
      }
    }
  }
}

App.settings_setup_checkboxes = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if ((props.category === category) && (props.type === `checkbox`)) {
      let el = DOM.el(`#settings_${key}`)
      el.checked = App.get_setting(key)

      DOM.ev(el, `change`, () => {
        App.set_setting({setting: key, value: el.checked, action: true})
      })
    }
  }
}

App.settings_setup_texts = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category !== category) {
      continue
    }

    if (!App.is_text_setting(props.type)) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      App.scroll_to_top(el)
      let value = el.value.trim()

      if (props.no_empty && (value === ``)) {
        value = App.get_default_setting(key) || App.get_setting(key)
      }

      if (props.character) {
        value = Array.from(value)[0]
      }

      el.value = value
      el.scrollTop = 0
      App.set_setting({setting: key, value, action: true})
    })
  }
}

App.settings_setup_numbers = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category !== category) {
      continue
    }

    if (props.type !== `number`) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      let value = parseInt(el.value)

      if (isNaN(value)) {
        value = App.get_setting(key)
      }

      if (value < parseInt(props.min || 0)) {
        value = props.min || 0
      }

      if (props.max) {
        if (value > props.max) {
          value = props.max
        }
      }

      el.value = value
      App.set_setting({setting: key, value, action: true})
    })
  }
}

App.setting_setup_lists = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      if (props.type !== `list`) {
        continue
      }

      Addlist.add_buttons(`settings_${key}`)
    }
  }
}

App.settings_make_menu = (setting, opts, action = () => {}) => {
  let no_wrap = [
    `width`,
    `height`,
    `background_opacity`,
    `background_zoom`,
    `font_size`,
    `window_border_width`,
    `close_button_border_width`,
    `close_button_border_width_tab_box`,
    `pinline_border_width`,
    `pinline_margin`,
    `item_height`,
    `item_icon`,
    `tab_box_size`,
    `close_button_size`,
    `close_button_size_tab_box`,
    `hover_button_size`,
    `footer_size`,
    `favorites_size`,
    `favorites_gap`,
    `main_title_size`,
    `main_title_left_button_size`,
    `main_title_right_button_size`,
    `main_title_font_size`,
  ]

  let btn_id = `settings_menubutton_${setting}`
  let wrap = !no_wrap.includes(setting)

  if (wrap) {
    wrap = !setting.endsWith(`_icon_weight`)
  }

  App[btn_id] = Menubutton.create({
    opts,
    button: DOM.el(`#settings_${setting}`),
    selected: App.get_setting(setting),
    wrap,
    on_change: (args, opt) => {
      App.set_setting({setting, value: opt.value, action: true})
      action()
    },
    get_value: () => {
      return App.get_setting(setting)
    },
    on_middle_click: () => {
      App.set_default_setting(setting, true)
      let value = App.get_default_setting(setting)
      App[btn_id].set(value, false)
    },
  })

  if (!App[btn_id].first_set) {
    App.error(`Menubutton not set: ${setting}`)
  }
}

App.add_settings_filter = (category) => {
  let container = DOM.el(`#settings_${category}_container`)
  let filter_container = DOM.create(`div`, `flex_row_center gap_1`)
  let filter = DOM.create(`input`, `settings_filter text small_filter`, `settings_${category}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  let count = DOM.els(`.settings_item`, container).length

  DOM.ev(filter, `input`, () => {
    App.filter_settings()
  })

  filter.placeholder = `Filter (${count})`
  let bottom = DOM.create(`div`, `button filter_btn`)
  bottom.textContent = App.filter_bottom_icon
  bottom.title = App.filter_bottom_title

  DOM.ev(bottom, `click`, () => {
    App.settings_bottom()
  })

  let clear = DOM.create(`div`, `button filter_btn`)
  clear.textContent = App.filter_clear_icon
  clear.title = App.filter_clear_title

  DOM.ev(clear, `click`, () => {
    filter.value = ``
    App.do_filter_settings()
    filter.focus()
  })

  filter_container.append(bottom)
  filter_container.append(filter)
  filter_container.append(clear)
  container.prepend(filter_container)
}

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
      App.set_filter({mode})
    }
    else {
      App.hide_window()
    }
  }
}

App.settings_filter_focused = () => {
  return DOM.class(document.activeElement, [`settings_filter`])
}

App.show_all_settings = () => {
  App.start_settings()
  App.settings_category = `all`
  App.show_window(`settings_all`)
}

App.prepare_all_settings = () => {
  let c = DOM.el(`#settings_all_container`)
  c.innerHTML = ``

  for (let key in App.setting_props) {
    let props = App.setting_props[key]
    let item = DOM.create(`div`, `settings_text_item settings_item filter_item action`)
    item.dataset.setting = key

    let cat = DOM.create(`div`)
    let name = App.category_string(props.category)
    let type = props.type

    if (type === `text_smaller`) {
      type = `text`
    }

    type = App.capitalize_words(type)
    cat.textContent = `${name} | ${type}`

    let text = DOM.create(`div`, `filter_text`)
    let icon = App.settings_icons[props.category]
    text.textContent = `${icon} ${props.name}`
    item.title = App.get_setting_info(props.info, key)

    item.append(text)
    item.append(cat)

    DOM.ev(item, `click`, () => {
      App.show_settings_category(props.category, props.name)
    })

    c.append(item)
  }

  App.add_settings_switchers(`all`)
  App.add_settings_filter(`all`)
  App.run_setting_setups(`all`)
}

App.prepare_settings_category = (category) => {
  DOM.el(`#setting_${category}`).innerHTML = ``

  App.settings_buttons(category)
  App.fill_settings(category)
  App.settings_setup_texts(category)
  App.settings_setup_checkboxes(category)
  App.settings_setup_numbers(category)
  App.setting_setup_lists(category)
  App.settings_setup_labels(category)
  App.add_settings_switchers(category)
  App.add_settings_filter(category)
  App.run_setting_setups(category)

  let container = DOM.el(`#settings_${category}_container`)
  container.classList.add(`filter_container`)

  for (let el of DOM.els(`.settings_item`, container)) {
    el.classList.add(`filter_item`)
  }

  for (let el of DOM.els(`.settings_label`, container)) {
    el.classList.add(`filter_text`)
    el.classList.add(`linkbutton`)
  }
}

App.run_setting_setups = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      if (props.setup) {
        props.setup(key)
      }
    }
  }
}

App.setup_settings = () => {
  App.save_settings_debouncer = App.create_debouncer(async (mirror = false) => {
    await App.stor_save_settings()

    if (mirror) {
      App.mirror_settings()
    }
  }, App.settings_save_delay)

  App.sort_catprops()

  App.check_refresh_settings_debouncer = App.create_debouncer(() => {
    App.do_check_refresh_settings()
  }, App.check_refresh_settings_delay)
}

App.refresh_settings = () => {
  App.build_shell()
  App.apply_theme()
  App.refresh_gestures()
  App.refresh_mouse()
  App.reset_tab_box()
  App.setup_commands()
  App.fill_palette()
  App.init_tab_box()
  App.build_tab_filters()
  App.reset_main_title()
  App.start_signal_intervals()
  App.start_idle_tabs_check()
  App.resolve_icons()
  App.refresh_context()
}

App.build_setting_cmds = () => {
  // None | Separator
  let single = [true, false]
  let menu = [false, true]
  let pure = [false, false]

  // All commands
  App.cmdlist_single = App.settings_commands(...single)
  App.cmdlist_menu = App.settings_commands(...menu)
  App.cmdlist_pure = App.settings_commands(...pure)

  // Only filter commands
  App.filter_cmds_menu = App.get_filter_cmds(...menu)

  // Only signal commands
  App.signal_cmds_single = App.get_signal_cmds(...single)
}

App.start_settings = () => {
  if (App.check_ready(`settings`)) {
    return
  }

  App.build_setting_cmds()

  let common = {
    persistent: false,
    colored_top: true,
    after_show: () => {
      let filter = App.get_settings_filter(App.settings_category)
      filter.focus()
    },
    on_hide: async () => {
      App.settings_ensure_save()
      App.save_last_settings()

      if (App.settings_changed()) {
        App.refresh_settings()
        App.clear_show()
      }
      else {
        App.show_main_mode()
      }
    },
  }

  let key = `all`

  App.create_window({...common, id: `settings_${key}`,
    element: App.settings_build_category(key),
    setup: () => {
      App.prepare_all_settings()
      let container = DOM.el(`#settings_${key}_container`)
      container.classList.add(`filter_container`)
      App.settings_gestures(container)
    },
  })

  for (let key in App.setting_catprops) {
    let catprops = App.setting_catprops[key]

    App.create_window({...common, id: `settings_${key}`,
      element: App.settings_build_category(key),
      setup: () => {
        App.prepare_settings_category(key)

        if (catprops.setup) {
          catprops.setup()
        }

        let container = DOM.el(`#settings_${key}_container`)
        App.settings_gestures(container)
      },
    })
  }

  App.setup_settings_addlist()

  App.settings_wheel = App.create_debouncer((e, direction) => {
    if (!direction) {
      direction = App.wheel_direction(e)
    }

    if (direction === `up`) {
      App.show_prev_settings()
    }
    else if (direction === `down`) {
      App.show_next_settings()
    }
  }, App.wheel_delay)

  App.filter_settings_debouncer = App.create_debouncer(() => {
    App.do_filter_settings()
  }, App.filter_delay_2)
}

App.add_settings_switchers = (category) => {
  let top = DOM.el(`#window_top_settings_${category}`)

  if (DOM.dataset(top, `done`)) {
    return
  }

  let container = DOM.create(`div`, `flex_row_center gap_15 grow`)
  top.append(container)
  let title = DOM.create(`div`, `settings_title button`)
  title.id = `settings_title_${category}`
  title.title = `Pick a Category`
  let icon = App.settings_icons[category]
  let text = App.category_string(category, true)
  title.append(App.button_text(icon, text))
  container.append(title)
  let actions = DOM.create(`div`, `button icon_button settings_actions`)
  actions.id = `settings_actions_${category}`
  actions.title = `Actions`
  actions.append(App.get_svg_icon(`sun`))
  container.append(actions)
  let close = DOM.create(`div`, `button settings_close`)
  close.textContent = App.close_text
  container.append(close)

  DOM.ev(actions, `click`, () => {
    App.settings_actions()
  })

  DOM.ev(close, `click`, () => {
    App.hide_window()
  })

  let prev = DOM.create(`div`, `button settings_arrow arrow_button arrow_prev`)
  prev.textContent = `<`
  prev.title = `Previous Category`
  container.prepend(prev)

  DOM.ev(prev, `click`, () => {
    App.show_prev_settings()
  })

  DOM.ev(prev, `auxclick`, (e) => {
    if (e.button === 1) {
      App.show_settings_category(`general`)
    }
  })

  let next = DOM.create(`div`, `button settings_arrow arrow_button arrow_next`)
  next.textContent = `>`
  next.title = `Next Category`
  container.append(next)

  DOM.ev(next, `click`, () => {
    App.show_next_settings()
  })

  DOM.ev(next, `auxclick`, (e) => {
    if (e.button === 1) {
      App.show_settings_category(`more`)
    }
  })

  DOM.ev(title, `click`, (e) => {
    App.show_settings_menu(e)
  })

  DOM.ev(title, `auxclick`, (e) => {
    if (e.button === 1) {
      App.show_settings_category(`general`)
    }
  })

  DOM.ev(DOM.parent(title, [`.window_top`]), `wheel`, (e) => {
    App.settings_wheel.call(e)
  })

  DOM.dataset(top, `done`, true)
}

App.start_color_picker = (setting, alpha = false) => {
  let el = DOM.el(`#settings_${setting}`)

  let picker = AColorPicker.createPicker(el, {
    showAlpha: alpha,
    showHSL: false,
    showRGB: true,
    showHEX: true,
    color: App.get_setting(setting),
  })

  picker.on(`change`, (picker, color) => {
    let rgb

    if (alpha) {
      rgb = AColorPicker.parseColor(color, `rgbacss`)
    }
    else {
      rgb = AColorPicker.parseColor(color, `rgbcss`)
    }

    App.set_setting({setting, value: rgb, action: true})
  })

  App[`settings_color_picker_${setting}`] = picker
}

App.settings_default_category = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      App.set_default_setting(key)
    }
  }
}

App.set_default_setting = (setting, action = false) => {
  App.set_setting({
    setting,
    value: App.default_setting_string,
    action,
  })
}

App.category_string = (category, compact = false) => {
  if (compact) {
    if (category === `bookmarks`) {
      category = `bkmarks`
    }
  }

  return App.capitalize_words(category)
}

App.reset_settings = (category) => {
  App.show_confirm({
    message: `Reset settings? (${App.category_string(category)})`,
    confirm_action: () => {
      App.settings_default_category(category)

      if (category === `gestures`) {
        App.refresh_gestures()
      }

      App.apply_theme()
      App.show_settings_category(category)
    },
  })
}

App.def_all_settings = () => {
  for (let key in App.setting_props) {
    App.set_default_setting(key)
  }
}

App.reset_all_settings = () => {
  App.show_confirm({
    message: `Reset all settings?`,
    confirm_action: () => {
      App.def_all_settings()
      App.restart_settings()
    },
  })
}

App.get_size_options = () => {
  let opts = []

  for (let i = 50; i <= 100; i += 5) {
    opts.push({text: `${i}%`, value: i})
  }

  return opts
}

App.show_settings = (e) => {
  if (App.get_setting(`direct_settings`)) {
    App.show_settings_category(`general`)
  }
  else {
    App.show_settings_menu(e)
  }
}

App.show_settings_category = (category, filter = ``) => {
  if (App.on_settings()) {
    App.save_last_settings()
  }
  else {
    App.initial_settings = App.str(App.settings)
  }

  App.start_settings()
  App.get_settings_with_list()
  App.settings_category = category
  App.show_window(`settings_${category}`)

  if (filter) {
    let el = App.get_settings_filter(category)
    el.value = filter
    App.do_filter_settings()
  }
}

App.show_prev_settings = () => {
  let index = App.settings_index()
  index -= 1

  if (index < 0) {
    index = App.settings_categories.length - 1
  }

  App.show_settings_category(App.settings_categories[index])
}

App.show_next_settings = () => {
  let index = App.settings_index()
  index += 1

  if (index >= App.settings_categories.length) {
    index = 0
  }

  App.show_settings_category(App.settings_categories[index])
}

App.settings_index = () => {
  return App.settings_categories.indexOf(App.settings_category)
}

App.show_settings_menu = (e) => {
  let items = App.settings_menu_items()
  App.show_context({items, e})
}

App.def_setting = (key) => {
  App.settings[key].value = App.default_setting_string
  App.settings[key].version = App.setting_props[key].version
}

App.get_settings_snapshot = (category = ``) => {
  let changed = {}

  for (let key in App.settings) {
    let props = App.settings[key]

    if (category) {
      let cat = App.setting_props[key].category

      if (cat !== category) {
        continue
      }
    }

    // Only export changed settings
    if (props.value !== App.default_setting_string) {
      changed[key] = props
    }
  }

  return changed
}

App.export_settings = (category = ``) => {
  let snapshot = App.get_settings_snapshot(category)
  let name

  if (category) {
    name = App.category_string(category)
  }
  else {
    name = `Settings`
  }

  App.export_data(name, snapshot)
}

App.import_settings = (value = ``) => {
  App.import_data(`Settings`, (obj) => {
    if (App.is_object(obj)) {
      for (let key in App.settings) {
        if (obj[key]) {
          App.settings[key] = obj[key]
        }
      }

      App.check_settings()
      App.stor_save_settings()
      App.restart_settings()
    }
  }, value)
}

App.export_theme = () => {
  App.export_settings(`theme`)
}

App.restart_settings = () => {
  App.refresh_settings()

  if (App.on_settings()) {
    App.show_settings_category(`general`)
  }
  else {
    App.clear_show()
  }
}

App.settings_label_menu = (e, args) => {
  let items = []

  for (let arg of args) {
    items.push({
      text: arg.name,
      action: arg.action,
    })
  }

  App.show_context({e, items})
}

App.setting_exists = (setting) => {
  return App.settings[setting] !== undefined
}

App.get_setting = (setting) => {
  if (App.settings[setting] === undefined) {
    App.error(`Setting not found: ${setting}`)
    return
  }

  let value = App.settings[setting].value

  if (value === App.default_setting_string) {
    value = App.get_default_setting(setting)
  }

  return value
}

App.set_setting = (args = {}) => {
  let def_args = {
    action: false,
  }

  App.def_args(def_args, args)

  if (App.settings[args.setting] === undefined) {
    App.error(`Setting not found: ${args.setting}`)
    return
  }

  let value_s = App.str(args.value)

  if (App.str(App.settings[args.setting].value) !== value_s) {
    let props = App.setting_props[args.setting]

    if (App.str(props.value) === value_s) {
      App.set_default_setting(args.setting, false)
    }
    else {
      App.settings[args.setting].value = args.value
    }

    let mirror = !props.no_mirror
    App.save_settings_debouncer.call(mirror)

    if (args.action) {
      if (props.actions) {
        App.settings_do_actions(props.actions)
      }
    }
  }
}

App.check_refresh_settings = () => {
  if (App.on_settings()) {
    App.check_refresh_settings_debouncer.call()
  }
}

App.do_check_refresh_settings = () => {
  App.check_refresh_settings_debouncer.cancel()

  if (App.on_settings()) {
    App.refresh_settings_category()
  }
}

App.refresh_settings_category = () => {
  App.show_settings_category(App.settings_category)
}

App.get_default_setting = (setting) => {
  let value = App.setting_props[setting].value

  if (typeof value === `object`) {
    value = App.clone(value)
  }

  return value
}

App.check_settings = () => {
  let changed = false

  for (let key in App.setting_props) {
    // Fill defaults
    if ((App.settings[key] === undefined) ||
      (App.settings[key].value === undefined) ||
      (App.settings[key].version === undefined)) {
      App.settings[key] = {}
      App.def_setting(key)
      changed = true
    }
  }

  for (let key in App.settings) {
    // Remove unused settings
    if (App.setting_props[key] === undefined) {
      App.debug(`Stor: Deleting setting: ${key}`)
      delete App.settings[key]
      changed = true
    }
    // Check new version
    else if (App.settings[key].version !== App.setting_props[key].version) {
      App.debug(`Stor: Upgrading setting: ${key}`)
      App.def_setting(key)
      changed = true
    }
  }

  if (changed) {
    App.stor_save_settings()
  }
}

App.on_settings = (mode = App.window_mode) => {
  if (!mode) {
    return false
  }

  return mode.startsWith(`settings_`)
}

App.add_setting_headers = (items, include_none, include_sep) => {
  if (include_none) {
    items.push({text: `Do Nothing`, value: `none`})
  }

  if (include_sep) {
    items.push({text: `-- Separator --`, value: App.separator_string})
  }

  if (items.length) {
    items.push({text: App.separator_string})
  }
}

App.clean_setting_headers = (items) => {
  if (!items.length) {
    return
  }

  if (items.at(-1).text === App.separator_string) {
    items.pop()
  }
}

App.settings_commands = (include_none, include_sep) => {
  let items = []

  App.add_setting_headers(items, include_none, include_sep)

  for (let cmd of App.commands) {
    if (cmd.skip_settings) {
      continue
    }

    App.add_settings_cmd(items, cmd)
  }

  App.clean_setting_headers(items)
  return items
}

App.add_settings_cmd = (items, cmd) => {
  items.push({
    text: cmd.name,
    value: cmd.cmd,
    icon: cmd.icon,
    info: cmd.info,
  })
}

App.get_filter_cmds = (include_none, include_sep) => {
  let items = []

  App.add_setting_headers(items, include_none, include_sep)

  for (let cmd of App.commands) {
    if (cmd.skip_settings) {
      continue
    }

    if (cmd.filter_mode) {
      App.add_settings_cmd(items, cmd)
    }
  }

  App.clean_setting_headers(items)
  return items
}

App.settings_menu_items = () => {
  let items = []

  items.push({
    text: `${App.green_icon} Find`,
    info: `Show all the settings`,
    action: () => {
      App.show_all_settings()
    },
  })

  items.push({
    text: `${App.green_icon} Return`,
    info: `Show the last settings`,
    action: () => {
      App.show_last_settings()
    },
  })

  items.push({
    separator: true,
  })

  for (let c of App.settings_categories) {
    let icon = App.settings_icons[c]
    let name = App.category_string(c, true)
    let props = App.setting_catprops[c]

    items.push({
      icon,
      text: name,
      info: App.tooltip(props.info),
      action: () => {
        App.show_settings_category(c)
      },
    })
  }

  return items
}

App.set_settings_menu = (setting, value, on_change) => {
  if (!value) {
    value = App.get_setting(setting)
  }

  App[`settings_menubutton_${setting}`].set(value, on_change)
}

App.settings_actions = () => {
  let category = App.settings_category
  let cat = App.category_string(category)
  let items = []

  items.push({
    icon: App.up_arrow_icon,
    text: `Go To Top`,
    action: () => {
      App.settings_top()
    },
  })

  items.push({
    icon: App.down_arrow_icon,
    text: `Go To Bottom`,
    action: () => {
      App.settings_bottom()
    },
  })

  App.sep(items)

  items.push({
    icon: App.data_icon,
    text: `Export ${cat}`,
    action: () => {
      App.export_settings(App.settings_category)
    },
  })

  items.push({
    icon: App.data_icon,
    text: `Reset ${cat}`,
    action: () => {
      App.reset_settings(App.settings_category)
    },
  })

  App.sep(items)

  items.push({
    icon: App.data_icon,
    text: `Export Settings`,
    action: () => {
      App.export_settings()
    },
  })

  items.push({
    icon: App.data_icon,
    text: `Import Settings`,
    action: () => {
      App.import_settings()
    },
  })

  App.sep(items)

  items.push({
    icon: App.data_icon,
    text: `Reset Settings`,
    action: () => {
      App.reset_all_settings()
    },
  })

  App.sep(items)

  items.push({
    icon: App.settings_icons.general,
    text: `Summary`,
    action: () => {
      App.settings_summary()
    },
  })

  items.push({
    icon: App.settings_icons.general,
    text: `Guides`,
    action: (e) => {
      App.show_setting_guides(e)
    },
  })

  let btn = DOM.el(`#settings_actions_${category}`)
  App.show_context({element: btn, items, expand: true, margin: btn.clientHeight})
}

App.settings_summary = () => {
  let lines = []
  let category = ``

  for (let key in App.setting_props) {
    let item = App.setting_props[key]

    if (item.category !== category) {
      let left = category ? `\n` : ``
      let cat = App.setting_catprops[item.category]
      let c_info = App.periods(cat.info)
      let s_cat = App.category_string(item.category)
      lines.push(`${left}# ${s_cat} - ${c_info}\n`)
      category = item.category
    }

    let info = App.periods(item.info)
    lines.push(`${key} (${item.type}) ${info}`)
  }

  let n = Object.keys(App.settings).length
  let title_icon = App.settings_icons.general
  App.show_textarea({title: `Settings (${n})`, title_icon, text: lines.join(`\n`)})
}

App.get_background_effect = (value) => {
  for (let key in App.remove_separators(App.background_effects)) {
    let eff = App.background_effects[key]

    if (eff.value === value) {
      return eff
    }
  }
}

App.settings_buttons = (category) => {
  let cat = App.setting_catprops[category]

  if (cat.buttons) {
    let btc = DOM.create(`div`, `settings_buttons`)

    for (let row of cat.buttons) {
      let row_el = DOM.create(`div`, `settings_buttons_row`)

      for (let item of row) {
        let btn = DOM.create(`div`, `button`)
        btn.textContent = item.text

        DOM.ev(btn, `click`, () => {
          item.action()
        })

        row_el.append(btn)
      }

      btc.append(row_el)
    }

    let c = DOM.el(`#setting_${category}`)
    let separator = App.settings_separator()
    c.append(separator)
    c.append(btc)
  }
}

App.fill_settings = (category) => {
  let c = DOM.el(`#setting_${category}`)

  function input(type, cls, placeholder) {
    let widget

    if (type === `textarea`) {
      widget = DOM.create(`textarea`, `text ${cls}`)
    }
    else {
      widget = DOM.create(`input`, `text ${cls}`)
    }

    widget.type = type
    widget.autocomplete = `off`
    widget.spellcheck = false
    widget.placeholder = placeholder || ``
    return widget
  }

  let separator = App.settings_separator()
  c.append(separator)

  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      let el = DOM.create(`div`, `settings_item`)
      let label = DOM.create(`div`, `settings_label`)
      label.id = `settings_label_${key}`
      label.textContent = props.name
      App.add_setting_label_menu(label, key)

      if (props.hide_name) {
        DOM.hide(label)
      }

      el.append(label)
      let widget

      if (props.type === `menu`) {
        widget = DOM.create(`div`, `menubutton button`)
      }
      else if (props.type === `list`) {
        widget = DOM.create(`div`, `addlist_control`)
        App.addlist_control_draggable(widget)
      }
      else if (props.type === `text`) {
        widget = input(`text`, `settings_text`, props.placeholder)
      }
      else if (props.type === `text_smaller`) {
        widget = input(`text`, `settings_text text_smaller`, props.placeholder)
      }
      else if (props.type === `password`) {
        widget = input(`password`, `settings_text`, props.placeholder)
      }
      else if (props.type === `textarea`) {
        widget = input(`textarea`, `settings_textarea`, props.placeholder)
      }
      else if (props.type === `number`) {
        widget = input(`number`, `settings_number`, props.placeholder)
        widget.min = props.min

        if (props.max) {
          widget.max = props.max
        }
      }
      else if (props.type === `checkbox`) {
        widget = DOM.create(`input`, `settings_checkbox`)
        widget.type = `checkbox`
      }
      else if (props.type === `color`) {
        widget = DOM.create(`div`, `settings_color`)
      }

      widget.id = `settings_${key}`
      el.append(widget)
      el.title = App.get_setting_info(props.info, key)
      c.append(el)

      if (props.separator) {
        c.append(App.settings_separator())
      }
    }
  }
}

App.get_settings_with_list = () => {
  if (!App.settings_with_list) {
    App.settings_with_list = []

    for (let key in App.setting_props) {
      let props = App.setting_props[key]

      if (props.type === `list`) {
        if (!App.settings_with_list.includes(props.category)) {
          App.settings_with_list.push(props.category)
        }
      }
    }
  }
}

App.setup_settings_addlist = () => {
  let {popobj, regobj} = App.get_setting_addlist_objects()
  let id = `settings_aliases`
  let props = App.setting_props.aliases

  let add_cmd_single = () => {
    let cmds = App.shuffle_array(App.commands)
    let ans = []

    for (let o of cmds.slice(0, 5)) {
      ans.push({
        cmd: o.cmd,
      })
    }

    return ans
  }

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [`a`, `b`],
      pk: `a`,
      widgets: {
        a: `text`,
        b: `text`,
      },
      labels: {
        a: `Term A`,
        b: `Term B`,
      },
      list_icon: (item) => {
        return App.settings_icons.filter
      },
      list_text: (item) => {
        return `${item.a} = ${item.b}`
      },
      required: {
        b: true,
      },
      tooltips: {
        a: `Term A`,
        b: `Term B`,
      },
      title: props.name,
    })})

  id = `settings_custom_filters`
  props = App.setting_props.custom_filters

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [`filter`],
      pk: `filter`,
      widgets: {
        filter: `text`,
      },
      labels: {
        filter: `Filter`,
      },
      list_icon: (item) => {
        return App.settings_icons.filter
      },
      list_text: (item) => {
        return item.filter
      },
      tooltips: {
        filter: `Add a custom filter`,
      },
      title: props.name,
    })})

  let menukeys = [
    `extra_menu`,
    `hover_button_menu`,
    `close_button_menu`,
    `footer_menu`,
    `pinline_menu`,
    `main_title_menu`,
    `main_title_left_button_menu`,
    `main_title_right_button_menu`,
    `tab_box_menu`,
    `favorites_menu`,
    `actions_menu`,
    `item_menu`,
    `empty_menu`,
    `stuff_menu`,
    `scroller_menu`,
  ]

  for (let m of App.modes) {
    menukeys.push(`hover_button_menu_${m}`)
    menukeys.push(`favorites_menu_${m}`)
    menukeys.push(`actions_menu_${m}`)
    menukeys.push(`item_menu_${m}`)
    menukeys.push(`empty_menu_${m}`)
  }

  for (let i = 1; i <= App.num_generic_menus; i++) {
    menukeys.push(`generic_menu_${i}`)
  }

  for (let key in App.setting_props) {
    if (menukeys.includes(key)) {
      let id = `settings_${key}`
      let props = App.setting_props[key]

      App.create_popup({...popobj, id: `addlist_${id}`,
        element: Addlist.register({...regobj, id,
          keys: [`cmd`, `middle`, `shift`, `ctrl`, `alt`],
          widgets: {
            cmd: `menu`,
            middle: `menu`,
            shift: `menu`,
            ctrl: `menu`,
            alt: `menu`,
          },
          labels: {
            cmd: `Command`,
            middle: `Middle`,
            shift: `Shift`,
            ctrl: `Ctrl`,
            alt: `Alt`,
          },
          sources: {
            cmd: () => {
              return App.cmdlist_menu.slice(0)
            },
            middle: () => {
              return App.cmdlist_single.slice(0)
            },
            shift: () => {
              return App.cmdlist_single.slice(0)
            },
            ctrl: () => {
              return App.cmdlist_single.slice(0)
            },
            alt: () => {
              return App.cmdlist_single.slice(0)
            },
          },
          list_icon: (item) => {
            return App.settings_cmd_icon(item.cmd)
          },
          list_text: (item) => {
            return App.settings_cmd_name(item.cmd)
          },
          tooltips: {
            cmd: `Command on Click`,
            middle: `Command on Middle Click`,
            shift: `Command on Shift + Click`,
            ctrl: `Command on Ctrl + Click`,
            alt: `Command on Alt + Click`,
          },
          title: props.name,
          special_add: () => {
            return add_cmd_single()
          },
        })})
    }
  }

  menukeys = [
    `favorite_filters`,
    `refine_filters`,
  ]

  for (let key in App.setting_props) {
    if (menukeys.includes(key)) {
      let id = `settings_${key}`
      let props = App.setting_props[key]

      App.create_popup({...popobj, id: `addlist_${id}`,
        element: Addlist.register({...regobj, id,
          keys: [`cmd`],
          pk: `cmd`,
          widgets: {
            cmd: `menu`,
          },
          labels: {
            cmd: `Command`,
          },
          sources: {
            cmd: () => {
              return App.filter_cmds_menu.slice(0)
            },
          },
          list_icon: (item) => {
            return App.settings_cmd_icon(item.cmd)
          },
          list_text: (item) => {
            return App.settings_cmd_name(item.cmd)
          },
          automenu: true,
          tooltips: {
            cmd: `Add a command`,
          },
          title: props.name,
        })})
    }
  }

  menukeys = [
    `custom_icon_commands`,
  ]

  for (let key in App.setting_props) {
    if (menukeys.includes(key)) {
      let id = `settings_${key}`
      let props = App.setting_props[key]

      App.create_popup({...popobj, id: `addlist_${id}`,
        element: Addlist.register({...regobj, id,
          keys: [`icon`, `cmd`],
          pk: `icon`,
          widgets: {
            icon: `text`,
            cmd: `menu`,
          },
          labels: {
            icon: `Icon`,
            cmd: `Command`,
          },
          sources: {
            cmd: () => {
              return App.cmdlist_pure.slice(0)
            },
          },
          list_icon: (item) => {
            return item.icon
          },
          list_text: (item) => {
            let cmd = App.settings_cmd_name(item.cmd)
            return `= ${cmd}`
          },
          title: props.name,
        })})
    }
  }

  menukeys = [
    `custom_tags`,
  ]

  for (let key in App.setting_props) {
    if (menukeys.includes(key)) {
      let id = `settings_${key}`
      let props = App.setting_props[key]

      App.create_popup({...popobj, id: `addlist_${id}`,
        element: Addlist.register({...regobj, id,
          keys: [`tag`],
          pk: `tag`,
          widgets: {
            tag: `text`,
          },
          labels: {
            tag: `Tag`,
          },
          list_icon: (item) => {
            return App.get_setting(`tags_icon`)
          },
          list_text: (item) => {
            return item.tag
          },
          title: props.name,
        })})
    }
  }

  App.start_domain_rules_addlist()
  App.start_bookmark_rules_addlist()
  App.start_signals_addlist()
  App.start_templates_addlist()
  App.start_command_combos_addlist()
  App.start_custom_commands_addlist()
  App.start_colors_addlist()
  App.start_keyboard_addlist()

  id = `settings_custom_urls`
  props = App.setting_props.custom_urls

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [`name`, `url`, `icon`],
      pk: `url`,
      widgets: {
        name: `text`,
        url: `text`,
        icon: `text`,
      },
      labels: {
        name: `Name`,
        url: `URL`,
        icon: `Icon`,
      },
      list_icon: (item) => {
        return item.icon || App.settings_icons.browser
      },
      list_text: (item) => {
        return item.name
      },
      required: {
        name: true,
        url: true,
      },
      process: {
        url: (url) => {
          return App.fix_url(url)
        },
      },
      tooltips: {
        name: `Name of the URL item`,
        url: `The URL of this item`,
        icon: `Icon for this item`,
      },
      title: props.name,
    })})
}

App.settings_build_category = (key) => {
  let cat = App.setting_catprops[key]
  let c = DOM.create(`div`, `settings_container`, `settings_${key}_container`)
  let info = DOM.create(`div`, `settings_info`)

  if (key === `all`) {
    info.textContent = App.periods(`These are all the settings. Click one to go to its category`)
  }
  else if (cat) {
    info.textContent = App.periods(cat.info)
  }

  c.append(info)
  let sub = DOM.create(`div`, `settings_subcontainer`, `setting_${key}`)
  c.append(sub)
  return c
}

App.edit_text_setting = (key) => {
  let props = App.setting_props[key]
  let el = DOM.el(`#settings_${key}`)

  App.show_input({
    title: props.name,
    button: `Save`,
    action: (text) => {
      let value = text.trim()
      App.set_setting({setting: key, value, action: true})
      el.value = App.get_setting(key)
      App.scroll_to_top(el)
      return true
    },
    value: App.get_setting(key),
  })
}

App.clear_text_setting = (key) => {
  let props = App.setting_props[key]
  let el = DOM.el(`#settings_${key}`)

  if (el.value === ``) {
    return
  }

  let force = false

  if (props.type !== `textarea`) {
    force = true
  }

  App.show_confirm({
    message: `Clear setting?`,
    confirm_action: () => {
      el.value = ``
      App.set_setting({setting: key, value: ``, action: true})
      el.focus()
    },
    force,
  })
}

App.is_default_setting = (setting) => {
  return (App.settings[setting].value === App.default_setting_string) ||
  (App.str(App.settings[setting].value) === App.str(App.get_default_setting(setting)))
}

App.check_setting_default = (setting) => {
  return App.is_default_setting(setting)
}

App.check_setting_empty = (setting) => {
  let props = App.setting_props[setting]
  let value = App.get_setting(setting)

  if (App.is_value_setting(props.type)) {
    return value === ``
  }
  else if (props.type === `list`) {
    return App.str(value) === App.str([])
  }
}

App.get_setting_addlist_objects = () => {
  function on_hide() {
    Addlist.hide()
  }

  let popobj = {
    on_hide,
  }

  let get_data = (id) => {
    let key = id.replace(`settings_`, ``)
    return App.get_setting(key)
  }

  let set_data = (id, value) => {
    let key = id.replace(`settings_`, ``)
    App.set_setting({setting: key, value, action: true})
  }

  let regobj = {
    get_data,
    set_data,
  }

  return {popobj, regobj}
}

App.mirror_settings = async () => {
  try {
    await browser.runtime.sendMessage({action: `mirror_settings`})
  }
  catch (err) {
    // Do nothing
  }
}

App.settings_content = () => {
  return DOM.el(`#window_content_settings_${App.settings_category}`)
}

App.settings_top = () => {
  let el = App.settings_content()
  el.scrollTop = 0
}

App.settings_bottom = () => {
  let el = App.settings_content()
  el.scrollTop = el.scrollHeight
}

App.toggle_setting = (setting, action = true) => {
  let value = App.get_setting(setting)
  App.set_setting({setting, value: !value, action})
}

App.prepend_list_setting = (setting, value, action = true) => {
  App.add_list_setting(`prepend`, setting, value, action)
}

App.append_list_setting = (setting, value, action = true) => {
  App.add_list_setting(`append`, setting, value, action)
}

App.add_list_setting = (what, setting, value, action) => {
  if (value._id_ === undefined) {
    value._id_ = `00_${App.settings_list_id}`
    App.settings_list_id += 1
  }

  let items = App.get_setting(setting)

  if (what === `append`) {
    items.push(value)
  }
  else if (what === `prepend`) {
    items.unshift(value)
  }

  App.set_setting({setting, value: items, action})
}

App.settings_changed = () => {
  let current = App.str(App.settings)
  return current !== App.initial_settings
}

App.swap_settings = (setting_1, setting_2) => {
  let btn_1 = App[`settings_menubutton_${setting_1}`]
  let btn_2 = App[`settings_menubutton_${setting_2}`]

  if (!btn_1 || !btn_2) {
    return
  }

  let value_1 = btn_1.value
  let value_2 = btn_2.value

  if (value_1 === value_2) {
    return
  }

  let ok_1 = false
  let ok_2 = false

  for (let opt of btn_1.opts) {
    if (opt.value === value_2) {
      ok_1 = true
      break
    }
  }

  for (let opt of btn_2.opts) {
    if (opt.value === value_1) {
      ok_2 = true
      break
    }
  }

  if (!ok_1 || !ok_2) {
    return
  }

  App.set_setting({setting: setting_1, value: value_2})
  App.set_setting({setting: setting_2, value: value_1})

  btn_1.set(value_2)
  btn_2.set(value_1)
}

App.setting_steps = (min, max, step, units = ``) => {
  let items = []

  for (let i = min; i <= max; i += step) {
    let text = `${i}${units}`.trim()
    items.push({value: i, text})
  }

  return items
}

App.settings_cmdlist_single = (key) => {
  return App.settings_make_menu(key, App.cmdlist_single)
}

App.setting_browser_commands = () => {
  let props = {}
  let item

  for (let i = 1; i <= App.num_browser_commands; i++) {
    let name = `browser_command_${i}`

    item = {
      name: `Browser Command ${i}`,
      type: `menu`,
      value: `none`,
      info: `Run this command when using the browser shortcut (${i})`,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
      version: 1,
    }

    props[name] = item
  }

  item.separator = true

  for (let i = 1; i <= App.num_browser_commands; i++) {
    let name = `popup_command_${i}`

    props[name] = {
      name: `Popup Command ${i}`,
      type: `menu`,
      value: `none`,
      info: `Run this command when using the browser shortcut but open the popup first (${i})`,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
      version: 1,
    }
  }

  return props
}

App.refresh_setting_widgets = (keys) => {
  if (!App.on_settings()) {
    return
  }

  function update(key) {
    let props = App.setting_props[key]
    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)

    if (props.type === `menu`) {
      App.set_settings_menu(key, undefined, false)
    }
    else if (props.type === `list`) {
      Addlist.update_count(`settings_${key}`)
    }
    else if (App.is_value_setting(props.type)) {
      el.value = value
    }
    else if (props.type === `checkbox`) {
      el.checked = value
    }
    else if (props.type === `color`) {
      let picker = App[`settings_color_picker_${key}`]
      picker.setColor(value)
    }
  }

  for (let key of keys) {
    update(key)
  }
}

App.get_settings_filter = (category) => {
  return DOM.el(`#settings_${category}_filter`)
}

App.save_last_settings = () => {
  let category = App.settings_category

  if ([`all`].includes(category)) {
    return
  }

  let el = App.settings_content()
  let scroll = el.scrollTop
  let filter = App.get_settings_filter(category).value

  App.last_settings = {
    category,
    scroll,
    filter,
  }
}

App.show_last_settings = () => {
  if (!Object.keys(App.last_settings).length) {
    App.show_settings_category(`general`)
  }
  else {
    let {category, scroll, filter} = App.last_settings
    App.show_settings_category(category, filter)

    if (scroll > 0) {
      setTimeout(() => {
        let el = App.settings_content()
        el.scrollTop = scroll
      }, App.last_settings_scroll_delay)
    }
  }
}

App.get_setting_info = (info, key) => {
  info = App.periods(info)
  return `${info}\nKey: ${key}`
}

App.get_setting_tab_box_modes = () => {
  let items = []

  for (let mode in App.tab_box_modes) {
    items.push({
      text: App.capitalize_words(mode),
      value: mode,
      icon: App.tab_box_modes[mode].icon,
    })
  }

  return items
}

App.settings_generic_menus = () => {
  let props = {}

  for (let i = 1; i <= App.num_generic_menus; i++) {
    let name = `generic_menu_icon_${i}`

    props[name] = {
      name: `Gen Menu Icon ${i}`,
      type: `text_smaller`,
      value: ``,
      actions: [`commands`],
      placeholder: `Icon`,
      info: `Icon of this Generic Menu (${i})`,
      version: 1,
    }

    name = `generic_menu_name_${i}`

    props[name] = {
      name: `Gen Menu Name ${i}`,
      type: `text`,
      value: ``,
      actions: [`commands`],
      placeholder: `Name`,
      info: `Name of this Generic Menu (${i})`,
      version: 1,
    }

    name = `generic_menu_${i}`

    props[name] = {
      name: `Generic Menu ${i}`,
      type: `list`,
      value: [],
      actions: [`commands`],
      data_group: `normal_menus`,
      info: `Generic menu you can add to other menus or call on command (${i})`,
      version: 1,
    }

    name = `compact_generic_menu_${i}`
    let separator = i < App.num_generic_menus

    props[name] = {
      name: `Compact Gen Menu ${i}`,
      type: `checkbox`,
      value: false,
      separator,
      info: `Only show icons in the Generic Menu ${i}`,
      version: 1,
    }
  }

  return props
}

App.settings_on_enter = () => {
  if (App.settings_category === `all`) {
    let container = DOM.el(`#settings_all_container`)
    let items = DOM.els(`.settings_item`, container)

    for (let item of items) {
      if (!DOM.is_hidden(item)) {
        let key = item.dataset.setting
        let props = App.setting_props[key]
        App.show_settings_category(props.category, props.name)
        return true
      }
    }
  }

  return false
}

App.settings_ensure_save = () => {
  let el = document.activeElement

  if (el.tagName === `INPUT`) {
    el.blur()
  }

  if (el.tagName === `TEXTAREA`) {
    el.blur()
  }
}

App.scroll_settings_up_down = (dir) => {
  let filter = App.get_settings_filter(App.settings_category)
  let amount = App.get_setting(`scroll_amount`)

  if (document.activeElement === filter) {
    let container = App.settings_content()

    if (dir === `up`) {
      container.scrollBy(0, -amount)
    }
    else {
      container.scrollBy(0, amount)
    }
  }
}

App.addlist_control_draggable = (el) => {
  el.draggable = true

  el.ondragstart = (e) => {
    e.dataTransfer.setData(`text/plain`, el.id)
  }
}

App.copy_settings_data = (sett_1, sett_2) => {
  let data = App.get_setting(sett_1)
  Addlist.after(`settings_${sett_2}`, data)
}

App.settings_cmd_icon = (cmd) => {
  let c = App.get_command(cmd)

  if (c) {
    return c.icon
  }

  return ``
}

App.settings_cmd_name = (cmd) => {
  if (cmd === App.separator_string) {
    return `-- Separator --`
  }

  let c = App.get_command(cmd)

  if (c) {
    return c.name
  }

  return `None`
}

App.set_default_font = () => {
  App.set_default_setting(`font_size`)
  App.apply_theme()
}

App.increase_font_size = () => {
  let current = App.get_setting(`font_size`)
  let new_size = current + 1

  if (new_size >= App.font_sizes[1]) {
    return
  }

  App.footer_message(`Font Size: ${new_size}`)
  App.set_setting({setting: `font_size`, value: new_size})
  App.apply_theme()
}

App.decrease_font_size = () => {
  let current = App.get_setting(`font_size`)
  let new_size = current - 1

  if (new_size <= App.font_sizes[0]) {
    return
  }

  App.footer_message(`Font Size: ${new_size}`)
  App.set_setting({setting: `font_size`, value: new_size})
  App.apply_theme()
}

App.check_setting_overrides = () => {
  for (let key in App.setting_overrides) {
    if (App.setting_props[key]) {
      App.setting_props[key].value = App.setting_overrides[key]
    }
  }
}

App.make_mouse_settings = (args = {}) => {
  let def_args = {
    click: ``,
    double_click: ``,
    middle_click: ``,
    ctrl_click: ``,
    shift_click: ``,
    ctrl_shift_click: ``,
    ctrl_middle_click: ``,
    shift_middle_click: ``,
    ctrl_shift_middle_click: ``,
    click_press: ``,
    middle_click_press: ``,
    wheel_up: ``,
    wheel_down: ``,
    wheel_up_shift: ``,
    wheel_down_shift: ``,
    click_version: 1,
    double_click_version: 1,
    middle_click_version: 1,
    click_press_version: 1,
    middle_click_press_version: 1,
    wheel_up_version: 1,
    wheel_down_version: 1,
    wheel_up_shift_version: 1,
    wheel_down_shift_version: 1,
    ctrl_click_version: 1,
    shift_click_version: 1,
    ctrl_middle_click_version: 1,
    shift_middle_click_version: 1,
    ctrl_shift_click_version: 1,
    ctrl_shift_middle_click_version: 1,
    separator: true,
    setup: (key) => {
      App.settings_cmdlist_single(key)
    },
  }

  App.def_args(def_args, args)
  let obj = {}

  if (args.click) {
    obj[`click_${args.what}`] = {
      name: `Click ${args.title}`,
      type: `menu`,
      value: args.click,
      info: `Command to run when clicking the ${args.title}`,
      version: args.click_version,
      setup: args.setup,
    }
  }

  if (args.double_click) {
    obj[`double_click_${args.what}`] = {
      name: `Double Click ${args.title}`,
      type: `menu`,
      value: args.double_click,
      info: `Command to run when double clicking the ${args.title}`,
      version: args.double_click_version,
      setup: args.setup,
    }
  }

  if (args.middle_click) {
    obj[`middle_click_${args.what}`] = {
      name: `Middle Click ${args.title}`,
      type: `menu`,
      value: args.middle_click,
      info: `Command to run when middle clicking the ${args.title}`,
      version: args.middle_click_version,
      setup: args.setup,
    }
  }

  if (args.ctrl_click) {
    obj[`ctrl_click_${args.what}`] = {
      name: `Ctrl Click ${args.title}`,
      type: `menu`,
      value: args.ctrl_click,
      info: `Command to run when ctrl clicking the ${args.title}`,
      version: args.ctrl_click_version,
      setup: args.setup,
    }
  }

  if (args.shift_click) {
    obj[`shift_click_${args.what}`] = {
      name: `Shift Click ${args.title}`,
      type: `menu`,
      value: args.shift_click,
      info: `Command to run when shift clicking the ${args.title}`,
      version: args.shift_click_version,
      setup: args.setup,
    }
  }

  if (args.ctrl_shift_click) {
    obj[`ctrl_shift_click_${args.what}`] = {
      name: `Ctrl Shift Click ${args.title}`,
      type: `menu`,
      value: args.ctrl_shift_click,
      info: `Command to run when ctrl shift clicking the ${args.title}`,
      version: args.ctrl_shift_click_version,
      setup: args.setup,
    }
  }

  if (args.ctrl_middle_click) {
    obj[`ctrl_middle_click_${args.what}`] = {
      name: `Ctrl Middle Click ${args.title}`,
      type: `menu`,
      value: args.ctrl_middle_click,
      info: `Command to run when ctrl middle clicking the ${args.title}`,
      version: args.ctrl_middle_click_version,
      setup: args.setup,
    }
  }

  if (args.shift_middle_click) {
    obj[`shift_middle_click_${args.what}`] = {
      name: `Shift Middle Click ${args.title}`,
      type: `menu`,
      value: args.shift_middle_click,
      info: `Command to run when shift middle clicking the ${args.title}`,
      version: args.shift_middle_click_version,
      setup: args.setup,
    }
  }

  if (args.ctrl_shift_middle_click) {
    obj[`ctrl_shift_middle_click_${args.what}`] = {
      name: `Ctrl Shift Middle Click ${args.title}`,
      type: `menu`,
      value: args.ctrl_shift_middle_click,
      info: `Command to run when ctrl shift middle clicking the ${args.title}`,
      version: args.ctrl_shift_middle_click_version,
      setup: args.setup,
    }
  }

  if (args.click_press) {
    obj[`click_press_${args.what}`] = {
      name: `Click Press ${args.title}`,
      type: `menu`,
      value: args.click_press,
      info: `Command to run when click pressing the ${args.title}`,
      version: args.click_press_version,
      setup: args.setup,
    }
  }

  if (args.middle_click_press) {
    obj[`middle_click_press_${args.what}`] = {
      name: `Middle Click Press ${args.title}`,
      type: `menu`,
      value: args.middle_click_press,
      info: `Command to run when middle click pressing the ${args.title}`,
      version: args.middle_click_press_version,
      setup: args.setup,
    }
  }

  if (args.wheel_up) {
    obj[`wheel_up_${args.what}`] = {
      name: `Wheel Up ${args.title}`,
      type: `menu`,
      value: args.wheel_up,
      info: `Command to run when using wheel up on the ${args.title}`,
      version: args.wheel_up_version,
      setup: args.setup,
    }
  }

  if (args.wheel_down) {
    obj[`wheel_down_${args.what}`] = {
      name: `Wheel Down ${args.title}`,
      type: `menu`,
      value: args.wheel_down,
      info: `Command to run when using wheel down on the ${args.title}`,
      version: args.wheel_down_version,
      setup: args.setup,
    }
  }

  if (args.wheel_up_shift) {
    obj[`wheel_up_shift_${args.what}`] = {
      name: `Shift Wheel Up ${args.title}`,
      type: `menu`,
      value: args.wheel_up_shift,
      info: `Command to run when using shift wheel up on the ${args.title}`,
      version: args.wheel_up_shift_version,
      setup: args.setup,
    }
  }

  if (args.wheel_down_shift) {
    obj[`wheel_down_shift_${args.what}`] = {
      name: `Shift Wheel Down ${args.title}`,
      type: `menu`,
      value: args.wheel_down_shift,
      info: `Command to run when using shift wheel down on the ${args.title}`,
      version: args.wheel_down_shift_version,
      setup: args.setup,
    }
  }

  if (args.separator) {
    let keys = Object.keys(obj)

    if (keys.length) {
      obj[keys.at(-1)].separator = true
    }
  }

  return obj
}

App.settings_separator = () => {
  return DOM.create(`div`, `settings_separator filter_ignore`)
}

App.get_setting_icon = (name) => {
  return App.get_setting(`${name}_icon`)
}

App.make_icon_settings = (args = {}) => {
  let def_args = {
    separator: true,
    tab_box: true,
    icon_version: 1,
    side_version: 1,
    show_version: 1,
    weight_version: 1,
    command_version: 1,
    tab_box_version: 1,
  }

  App.def_args(def_args, args)
  let obj = {}

  if (args.icon) {
    obj[`${args.what}_icon`] = {
      name: `${args.name} Icon`,
      type: `text_smaller`,
      value: args.icon,
      no_empty: true,
      placeholder: App.icon_placeholder,
      info: args.info,
      version: args.icon_version,
    }
  }

  obj[`${args.what}_icon_side`] = {
    name: `${args.name} Icon Side`,
    type: `menu`,
    value: args.side,
    info: `Show the ${args.name} Icon on the left or right of text`,
    version: args.side_version,
    setup: (key) => {
      App.settings_make_menu(key, App.sides)
    },
  }

  obj[`show_${args.what}_icon`] = {
    name: `Show ${args.name} Icon`,
    type: `menu`,
    value: args.show,
    info: `When to show the ${args.name} Icon`,
    version: args.show_version,
    setup: (key) => {
      App.settings_make_menu(key, App.show_icon)
    },
  }

  obj[`${args.what}_icon_weight`] = {
    name: `${args.name} Icon Weight`,
    type: `menu`,
    value: 1,
    info: `How much to the right should the ${args.name} Icon be`,
    version: args.weight_version,
    setup: (key) => {
      App.settings_make_menu(key, App.icon_weight)
    },
  }

  if (args.cmd) {
    obj[`${args.what}_icon_command`] = {
      name: `${args.name} Icon Command`,
      type: `menu`,
      value: args.cmd,
      info: `Command to run when clicking the ${args.name} Icon`,
      version: args.command_version,
      setup: (key) => {
        App.settings_cmdlist_single(key)
      },
    }
  }

  obj[`${args.what}_icon_tab_box`] = {
    name: `${args.name} Icon Tab Box`,
    type: `checkbox`,
    value: args.tab_box,
    info: `Show the ${args.name} Icon in the Tab Box`,
    version: args.tab_box_version,
  }

  if (args.separator) {
    let keys = Object.keys(obj)

    if (keys.length) {
      obj[keys.at(-1)].separator = true
    }
  }

  return obj
}

App.show_setting_guides = (e) => {
  let items = []

  for (let [i, guide] of App.setting_guides.entries()) {
    items.push({
      icon: App.info_icon,
      text: guide.title,
      action: () => {
        App.show_setting_guide(i)
      },
    })
  }

  App.show_context({
    e,
    items,
    expand: true,
    title: `Setting Guides`,
    title_icon: App.settings_icons.general,
  })
}

App.show_setting_guide = (i, focused_button = 1) => {
  if (i < 0) {
    i = App.setting_guides.length - 1
  }

  if (i >= App.setting_guides.length) {
    i = 0
  }

  let guide = App.setting_guides[i]

  if (!guide) {
    return
  }

  let buttons = []

  buttons.push([
    `Prev`, () => {
      App.show_setting_guide(i - 1, 0)
    },
  ])

  buttons.push([
    `Next`, () => {
      App.show_setting_guide(i + 1, 1)
    },
  ])

  App.show_dialog({
    message: App.indent(guide.text),
    focused_button,
    buttons,
  })
}

App.is_text_setting = (type) => {
  return [`text`, `text_smaller`, `password`, `textarea`].includes(type)
}

App.is_value_setting = (type) => {
  return App.is_text_setting(type) || (type === `number`)
}

App.reset_setting = (key) => {
  let props = App.setting_props[key]
  let el = DOM.el(`#settings_${key}`)

  if (props.type === `checkbox`) {
    App.set_default_setting(key, true)
    el.checked = App.get_setting(key)
  }
  else if (App.is_text_setting(props.type)) {
    let force = App.check_setting_default(key) || App.check_setting_empty(key)

    if (props.type !== `textarea`) {
      force = true
    }

    App.show_confirm({
      message: `Reset setting?`,
      confirm_action: () => {
        App.set_default_setting(key, true)
        el.value = App.get_setting(key)
        App.scroll_to_top(el)
      },
      force,
    })
  }
  else if (props.type === `number`) {
    App.set_default_setting(key, true)
    el.value = App.get_setting(key)
  }
  else if (props.type === `list`) {
    let force = App.check_setting_default(key) || App.check_setting_empty(key)

    App.show_confirm({
      message: `Reset setting?`,
      confirm_action: () => {
        App.set_default_setting(key, true)
        Addlist.update_count(`settings_${key}`)
      },
      force,
    })
  }
  else if (props.type === `menu`) {
    App.set_default_setting(key, true)
    App.set_settings_menu(key, undefined, false)
  }
  else if (props.type === `color`) {
    let picker = App[`settings_color_picker_${key}`]
    picker.setColor(App.get_default_setting(key))
    App.set_default_setting(key, true)
  }
}

App.copy_setting_value = (key) => {
  let el = DOM.el(`#settings_${key}`)

  if (el.value === ``) {
    return
  }

  App.copy_to_clipboard(el.value)
}

App.add_setting_label_menu = (label, key) => {
  let props = App.setting_props[key]
  let menu = []

  menu.push({
    name: `Reset`, action: () => {
      App.reset_setting(key)
    },
  })

  if (App.is_value_setting(props.type)) {
    menu.push({
      name: `Copy`, action: () => {
        App.copy_setting_value(key)
      },
    })
  }

  if (App.is_text_setting(props.type)) {
    menu.push({
      name: `Edit`, action: () => {
        App.edit_text_setting(key)
      },
    })

    if (!props.no_empty) {
      menu.push({
        name: `Clear`, action: () => {
          App.clear_text_setting(key)
        },
      })
    }
  }

  DOM.ev(label, `click`, (e) => {
    App.settings_label_menu(e, menu)
  })

  DOM.ev(label, `contextmenu`, (e) => {
    e.preventDefault()
    App.settings_label_menu(e, menu)
  })

  DOM.ev(label, `auxclick`, (e) => {
    if (e.button === 1) {
      App.reset_setting(key)
    }
  })
}

App.sort_settings = () => {
  if (App.get_setting(`sort_settings`)) {
    let keys = Object.keys(App.setting_catprops)
    keys.sort()
  }
}

App.check_init_settings = () => {
  let init_settings = localStorage.getItem(`init_settings`) || `nothing`

  if (init_settings !== `nothing`) {
    let split = init_settings.split(`|`)
    App.show_settings_category(split[0], split[1])
  }

  localStorage.setItem(`init_settings`, `nothing`)
}

App.open_settings = (category, filter) => {
  localStorage.setItem(`init_settings`, `${category}|${filter}`)
  App.open_sidebar()
  App.close_window()
}