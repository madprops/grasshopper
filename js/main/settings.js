App.settings_do_action = (what) => {
  if (what === `theme`) {
    App.apply_theme()
  }
  else if (what === `filter_debouncers`) {
    App.start_filter_debouncers()
  }
}

App.get_settings_label = (setting) => {
  let item = DOM.el(`#settings_${setting}`)
  let container = item.closest(`.settings_item`)
  let label = DOM.el(`.settings_label`, container)
  return label
}

App.settings_setup_labels = (category) => {
  function proc (item, btns) {
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

      if (btns.length) {
        proc(DOM.el(`#settings_label_${key}`), btns)
      }
    }
  }
}

App.settings_setup_checkboxes = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if ((props.category === category) && props.type === `checkbox`) {
      let el = DOM.el(`#settings_${key}`)
      el.checked = App.get_setting(key)

      DOM.ev(el, `change`, () => {
        App.set_setting(key, el.checked)
      })

      DOM.ev(App.get_settings_label(key), `click`, (e) => {
        App.settings_label_menu(e,
        [
          {
            name: `Reset`, action: () => {
              App.set_default_setting(key)
              el.checked = App.get_setting(key)
            }
          },
        ])
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

    if (props.type !== `text` && props.type !== `text_smaller` && props.type !== `textarea`) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      App.scroll_to_top(el)
      let value = el.value.trim()

      if (props.no_empty) {
        if (value === ``) {
          el.value = App.get_setting(key)
          return
        }
      }

      el.value = value
      el.scrollTop = 0
      App.set_setting(key, value)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          App.set_default_setting(key)
          el.value = App.get_setting(key)
          App.scroll_to_top(el)
        },
      },
      {
        name: `Copy`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.copy_to_clipboard(el.value)
        },
      },
    ]

    menu.push({
      name: `Edit`,  action: () => {
        App.edit_text_setting(key)
      },
    })

    if (!props.no_empty) {
      menu.push({
        name: `Clear`,  action: () => {
          el.value = ``
          App.set_setting(key, ``)
          el.focus()
        },
      })
    }

    DOM.ev(App.get_settings_label(key), `click`, (e) => {
      App.settings_label_menu(e, menu)
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
      App.set_setting(key, value)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          App.set_default_setting(key)
          let value = App.get_setting(key)
          el.value = value
        },
      },
      {
        name: `Copy`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.copy_to_clipboard(el.value)
        },
      },
    ]

    DOM.ev(App.get_settings_label(key), `click`, (e) => {
      App.settings_label_menu(e, menu)
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

      let menu = [
        {
          name: `Reset`,  action: () => {
            App.set_default_setting(key)
            Addlist.update_count(`settings_${key}`)
          },
        },
      ]

      DOM.ev(App.get_settings_label(key), `click`, (e) => {
        App.settings_label_menu(e, menu)
      })
    }
  }
}

App.settings_make_menu = (setting, opts, action = () => {}) => {
  let no_wrap = [`font_size`, `width`, `height`]

  App[`settings_menubutton_${setting}`] = Menubutton.create({
    opts: opts,
    button: DOM.el(`#settings_${setting}`),
    selected: App.get_setting(setting),
    wrap: !no_wrap.includes(setting),
    on_change: (args, opt) => {
      App.set_setting(setting, opt.value)
      action()
    },
    get_value: () => {
      return App.get_setting(setting)
    },
  })

  DOM.ev(App.get_settings_label(setting), `click`, (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          App.set_default_setting(setting)
          App.set_settings_menu(setting, undefined, false)
          action()
        }
      },
    ])
  })
}

App.add_settings_filter = (category) => {
  let container = DOM.el(`#settings_${category}_container`)
  let filter = DOM.create(`input`, `settings_filter text small_filter`, `settings_${category}_filter`)
  filter.type = `text`
  filter.autocomplete = `off`
  filter.spellcheck = false
  let s = ``

  if (App.get_setting(`debug_mode`)) {
    let items = DOM.els(`.settings_item`, container)
    s = ` (${items.length})`
  }

  DOM.ev(filter, `input`, () => {
    App.filter_settings()
  })

  filter.placeholder = `Filter${s}`
  container.prepend(filter)
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
      App.set_filter({mode: mode})
    }
    else {
      App.hide_window()
    }
  }
}

App.settings_filter_focused = () => {
  return document.activeElement.classList.contains(`settings_filter`)
}

App.prepare_settings_category = (category) => {
  App.fill_settings(category)
  App.settings_buttons(category)
  App.settings_setup_texts(category)
  App.settings_setup_checkboxes(category)
  App.settings_setup_numbers(category)
  App.setting_setup_lists(category)
  App.settings_setup_labels(category)
  App.add_settings_switchers(category)
  App.add_settings_filter(category)
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

App.setup_settings = () => {
  window.addEventListener(`storage`, (e) => {
    if (e.key === App.stor_settings_name) {
      App.debug(`Settings changed in another window`)
      App.stor_get_settings()
      App.restart_settings(`sync`)
    }
  })

  App.save_settings_debouncer = App.create_debouncer(() => {
    App.stor_save_settings()
  }, App.settings_save_delay)

  App.settings_categories = Object.keys(App.setting_catprops)
}

App.refresh_settings = () => {
  App.apply_theme()
  App.refresh_gestures()
  App.setup_commands()
  App.fill_palette()
  App.build_tab_filters()
}

App.start_settings = () => {
  if (App.check_ready(`settings`)) {
    return
  }

  App.cmdlist = App.settings_commands()
  App.cmdlist_2 = App.settings_commands(false)
  App.filter_cmds = App.cmdlist_2.filter(x => x.text.includes(`Filter`))

  let common = {
    persistent: false,
    colored_top: true,
    after_show: () => {
      DOM.el(`#settings_${App.settings_category}_filter`).focus()
    },
    on_hide: async () => {
      App.refresh_settings()
      App.clear_show()
    },
  }

  for (let key in App.setting_catprops) {
    let catprops = App.setting_catprops[key]

    App.create_window(Object.assign({}, common, {
      id: `settings_${key}`,
      element: App.settings_build_category(key),
      setup: () => {
        App.prepare_settings_category(key)
        catprops.setup()
      },
    }))
  }

  App.setup_settings_addlist()

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

  App.filter_settings_debouncer = App.create_debouncer(() => {
    App.do_filter_settings()
  }, App.filter_delay_2)
}

App.add_settings_switchers = (category) => {
  let top = DOM.el(`#window_top_settings_${category}`)

  if (DOM.dataset(top, `done`)) {
    return
  }

  let container = DOM.create(`div`, `flex_row_center gap_2 grow`)
  top.append(container)
  let title = DOM.create(`div`, `settings_title button`)
  title.id = `settings_title_${category}`
  let icon = App.settings_icons[category]
  let text = App.category_string(category)
  title.textContent = App.button_text(icon, text)
  container.append(title)
  let actions = DOM.create(`div`, `button icon_button`)
  actions.id = `settings_actions_${category}`
  actions.append(App.create_icon(`sun`))
  container.append(actions)
  let close = DOM.create(`div`, `button`)
  close.textContent = App.close_text
  container.append(close)

  DOM.ev(actions, `click`, () => {
    App.settings_actions(category)
  })

  DOM.ev(close, `click`, () => {
    App.hide_window()
  })

  let prev = DOM.create(`div`, `button arrow_prev`)
  prev.textContent = `<`
  container.prepend(prev)

  DOM.ev(prev, `click`, () => {
    App.show_prev_settings()
  })

  let next = DOM.create(`div`, `button arrow_next`)
  next.textContent = `>`
  container.append(next)

  DOM.ev(next, `click`, () => {
    App.show_next_settings()
  })

  DOM.ev(title, `click`, (e) => {
    App.show_settings_menu(e)
  })

  DOM.ev(title, `auxclick`, (e) => {
    if (e.button === 1) {
      App.hide_window()
    }
  })

  DOM.ev(title.closest(`.window_top`), `wheel`, (e) => {
    App.settings_wheel.call(e)
  })

  DOM.dataset(top, `done`, true)
}

App.start_color_picker = (setting, alpha = false) => {
  let el = DOM.el(`#settings_${setting}`)

  App[setting] = AColorPicker.createPicker(el, {
    showAlpha: alpha,
    showHSL: false,
    showHEX: false,
    showRGB: true,
    color: App.get_setting(setting)
  })

  App[setting].on(`change`, (picker, color) => {
    App.set_setting(setting, color)
  })

  DOM.ev(App.get_settings_label(setting), `click`, (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          App[setting].setColor(App.get_default_setting(setting))
          App.set_default_setting(setting)
        }
      },
    ])
  })
}

App.settings_default_category = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      App.set_default_setting(key, false)
    }
  }
}

App.set_default_setting = (setting, do_action) => {
  App.set_setting(setting, App.default_setting_string, do_action)
}

App.category_string = (category) => {
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

App.reset_all_settings = () => {
  App.show_confirm({
    message: `Reset all settings?`,
    confirm_action: () => {
      for (let key in App.setting_props) {
        App.set_default_setting(key)
      }

      App.restart_settings()
    },
  })
}

App.get_size_options = () => {
  let opts = []

  for (let i=50; i<=100; i+=5) {
    opts.push({text: `${i}%`, value: i})
  }

  return opts
}

App.show_settings = () => {
  App.show_settings_category(`general`)
}

App.show_settings_resolve = (e) => {
  if (App.get_setting(`direct_settings`)) {
    App.show_settings()
  }
  else {
    App.show_settings_menu(e)
  }
}

App.show_settings_category = (category) => {
  App.start_settings()
  App.get_settings_with_list()
  App.settings_category = category
  App.show_window(`settings_${category}`)
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
  App.show_context({items: items, e: e})
}

App.export_settings = () => {
  App.export_data(App.settings)
}

App.import_settings = () => {
  App.import_data((json) => {
    if (App.is_object(json)) {
      App.settings = json
      App.check_settings()
      App.stor_save_settings()
      App.restart_settings()
    }
  })
}

App.restart_settings = (type = `normal`) => {
  App.refresh_settings()

  if (App.on_items() || type === `sync`) {
    App.clear_show()
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
    text: `Reset All`,
    action: () => {
      App.reset_all_settings()
    }
  })

  return items
}

App.settings_label_menu = (e, args) => {
  let items = []

  for (let arg of args) {
    items.push({
      text: arg.name,
      action: arg.action,
    })
  }

  App.show_context({e: e, items: items})
}

App.get_setting = (setting) => {
  let value = App.settings[setting].value

  if (value === App.default_setting_string) {
    value = App.get_default_setting(setting)
  }

  return value
}

App.set_setting = (setting, value, do_action = true) => {
  if (App.str(App.settings[setting].value) !== App.str(value)) {
    App.settings[setting].value = value
    App.save_settings_debouncer.call()

    if (do_action) {
      let props = App.setting_props[setting]

      if (props.action) {
        App.settings_do_action(props.action)
      }
    }
  }
}

App.get_default_setting = (setting) => {
  let value = App.setting_props[setting].value

  if (typeof value === `object`) {
    value = [...value]
  }

  return value
}

App.check_settings = () => {
  let changed = false

  function set_default (setting) {
    App.settings[setting].value = App.default_setting_string
    App.settings[setting].version = App.setting_props[setting].version
  }

  for (let key in App.setting_props) {
    // Fill defaults
    if (App.settings[key] === undefined ||
      App.settings[key].value === undefined ||
      App.settings[key].version === undefined)
    {
      App.debug(`Stor: Adding setting: ${key}`)
      App.settings[key] = {}
      set_default(key)
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
      set_default(key)
      changed = true
    }
  }

  if (changed) {
    App.stor_save_settings()
  }
}

App.on_settings = (mode = App.window_mode) => {
  return mode.startsWith(`settings_`)
}

App.settings_commands = (include_none = true) => {
  let items = []

  if (include_none) {
    items = [
      {text: `Do Nothing`, value: `none`},
      {text: App.separator_string},
    ]
  }

  for (let cmd of App.commands) {
    if (cmd.name === App.separator_string) {
      items.push({text: App.separator_string})
    }
    else {
      items.push({text: cmd.name, value: cmd.cmd, icon: cmd.icon, info: cmd.info})
    }
  }

  return items
}

App.settings_menu_items = () => {
  let items = []

  for (let c of App.settings_categories) {
    let icon = App.settings_icons[c]
    let name = App.category_string(c)

    items.push({
      icon: icon,
      text: name,
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

App.settings_actions = (category) => {
  let items = []

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
    },
  })

  let btn = DOM.el(`#settings_actions_${category}`)
  App.show_context({element: btn, items: items, expand: true, margin: btn.clientHeight})
}

App.get_background_effect = (value) => {
  for (let key in App.background_effects) {
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

    DOM.el(`#setting_${category}`).before(btc)
  }
}

App.fill_settings = (category) => {
  let c = DOM.el(`#setting_${category}`)
  c.innerHTML = ``

  function input (type, cls, placeholder) {
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

  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category === category) {
      let el = DOM.create(`div`, `settings_item`)
      let label = DOM.create(`div`, `settings_label`)
      label.id = `settings_label_${key}`
      label.textContent = props.name

      if (props.hide_name) {
        label.classList.add(`hidden`)
      }

      el.append(label)
      let widget

      if (props.type === `menu`) {
        widget = DOM.create(`div`, `menubutton button`)
      }
      else if (props.type === `list`) {
        widget = DOM.create(`div`, `addlist_control`)
      }
      else if (props.type === `text`) {
        widget = input(`text`, `settings_text`, props.placeholder)
      }
      else if (props.type === `text_smaller`) {
        widget = input(`text`, `settings_text text_smaller`, props.placeholder)
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
      el.title = App.single_space(props.info)

      if (App.get_setting(`debug_mode`)) {
        el.title += ` (${key})`
      }

      c.append(el)

      if (props.separator) {
        c.append(DOM.create(`div`, `settings_separator filter_ignore`))
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
  function cmd_name (cmd) {
    let c = App.get_command(cmd)

    if (c) {
      return c.name
    }
    else {
      return `None`
    }
  }

  function on_hide () {
    Addlist.hide()
  }

  let popobj = {
    on_hide: on_hide,
  }

  let get_data = (id) => {
    let key = id.replace(`settings_`, ``)
    return App.get_setting(key)
  }

  let set_data = (id, value) => {
    let key = id.replace(`settings_`, ``)
    App.set_setting(key, value)
  }

  let regobj = {
    get_data: get_data,
    set_data: set_data,
  }

  let id = `settings_aliases`
  let props = App.setting_props.aliases

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
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
      list_text: (items) => {
        return `${items.a} = ${items.b}`
      },
      title: props.name,
      required: {
        b: true,
      },
    }))
  }))

  id = `settings_custom_filters`
  props = App.setting_props.custom_filters

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      keys: [`filter`],
      pk: `filter`,
      widgets: {
        filter: `text`,
      },
      labels: {
        filter: `Filter`,
      },
      list_text: (items) => {
        return items.filter
      },
      title: props.name,
    }))
  }))

  id = `settings_keyboard_shortcuts`
  props = App.setting_props.keyboard_shortcuts

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      keys: [`key`, `cmd`, `ctrl`, `shift`, `alt`],
      pk: `key`,
      widgets: {
        key: `key`,
        cmd: `menu`,
        ctrl: `checkbox`,
        shift: `checkbox`,
        alt: `checkbox`,
      },
      labels: {
        key: `Key`,
        cmd: `Command`,
        ctrl: `Require Ctrl`,
        shift: `Require Shift`,
        alt: `Require Alt`,
      },
      sources: {
        cmd: App.cmdlist_2.slice(0),
        ctrl: true,
        shift: false,
        alt: false,
      },
      list_text: (items) => {
        let cmd = cmd_name(items.cmd)
        return `${items.key} = ${cmd}`
      },
      title: props.name,
      required: {
        cmd: true,
      },
    }))
  }))

  let menukeys = [
    `favorites_menu`,
    `extra_menu`,
    `hover_menu`,
  ]

  for (let key in App.setting_props) {
    let id = `settings_${key}`
    props = App.setting_props[key]

    if (menukeys.includes(key)) {
      App.create_popup(Object.assign({}, popobj, {
        id: `addlist_${id}`,
        element: Addlist.register(Object.assign({}, regobj, {
          id: id,
          keys: [`cmd`, `alt`],
          pk: `cmd`,
          widgets: {
            cmd: `menu`,
            alt: `menu`,
          },
          labels: {
            cmd: `Command`,
            alt: `Alternative`,
          },
          sources: {
            cmd: App.cmdlist_2.slice(0),
            alt: App.cmdlist.slice(0),
          },
          list_text: (items) => {
            return cmd_name(items.cmd)
          },
          title: props.name,
          tooltips: {
            cmd: `Command on click`,
            alt: `Command on middle click`
          },
        }))
      }))
    }
  }

  id = `settings_domain_rules`
  props = App.setting_props.domain_rules

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      keys: [
        `domain`,
        `exact`,
        `color`,
        `title`,
        `icon`,
        `tags`,
        `notes`,
        `split_top`,
        `split_bottom`,
      ],
      pk: `domain`,
      widgets: {
        domain: `text`,
        color: `menu`,
        title: `text`,
        icon: `text`,
        tags: `text`,
        notes: `textarea`,
        split_top: `checkbox`,
        split_bottom: `checkbox`,
        exact: `checkbox`,
      },
      labels: {
        domain: `Domain`,
        color: `Color`,
        title: `Title`,
        icon: `Icon`,
        tags: `Tags`,
        notes: `Notes`,
        split_top: `Split Top`,
        split_bottom: `Split Bottom`,
        exact: `Exact`,
      },
      sources: {
        color: App.color_values(),
      },
      process: {
        domain: (value) => {
          return App.get_path(value)
        }
      },
      validate: (values) => {
        if (!values[`domain`]) {
          return false
        }

        if ((values[`color`] === `none`) &&
        !values[`title`] &&
        !values[`icon`] &&
        !values[`tags`] &&
        !values[`split_top`] &&
        !values[`split_bottom`] &&
        !values[`notes`]) {
          return false
        }

        return true
      },
      tooltips: {
        domain: `The domain name to check. Wildcards (*) are allowed.`,
        exact: `Match exact URL`
      },
      list_text: (items) => {
        return items.domain
      },
      title: props.name,
    }))
  }))
}

App.settings_build_category = (key) => {
  let cat = App.setting_catprops[key]
  let c = DOM.create(`div`, `settings_container`, `settings_${key}_container`)
  let info = DOM.create(`div`, `settings_info`)
  info.textContent = cat.info
  c.append(info)
  let sub = DOM.create(`div`, `settings_subcontainer`, `setting_${key}`)
  c.append(sub)
  return c
}

App.pick_background = (e) => {
  let items = []

  for (let num=1; num<=App.num_backgrounds; num++) {
    items.push({
      text: `Background ${num}`,
      action: () => {
        App.do_pick_background(num)
      },
      image: App.background_path(num)
    })
  }

  App.show_context({e: e, items: items})
}

App.do_pick_background = (num) => {
  let value = `Background ${num}`
  DOM.el(`#settings_background_image`).value = value
  App.set_setting(`background_image`, value)
}

App.background_path = (num) => {
  return App.backgrounds_dir + `background_${num}.jpg`
}

App.pick_font = (e) => {
  let items = []

  for (let font of App.local_fonts) {
    items.push({
      text: font,
      action: () => {
        App.do_pick_font(font)
      },
    })
  }

  App.show_context({e: e, items: items})
}

App.do_pick_font = (font) => {
  DOM.el(`#settings_font`).value = font
  App.set_setting(`font`, font)
}

App.edit_text_setting = (key) => {
  let props = App.setting_props[key]
  let el = DOM.el(`#settings_${key}`)

  App.show_input({
    message: props.name,
    button: `Save`,
    action: (text) => {
      let value = text.trim()
      App.set_setting(key, value)
      el.value = App.get_setting(key)
      App.scroll_to_top(el)
      return true
    },
    value: App.get_setting(key),
  })
}

App.color_values = () => {
  let items = []

  items.push({
    text: `None`,
    value: `none`,
  })

  for (let color of App.colors) {
    items.push({
      icon: App.color_icon(color),
      text: App.capitalize(color),
      value: color,
    })
  }

  return items
}

App.start_setting_colors = (category) => {
  for (let key in App.setting_props) {
    let props = App.setting_props[key]

    if (props.category !== category) {
      continue
    }

    if (props.type !== `color`) {
      continue
    }

    App.start_color_picker(key)
  }
}