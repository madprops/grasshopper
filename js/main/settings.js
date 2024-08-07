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
    }
    else if (action === `filters`) {
      App.start_filter_debouncers()
    }
    else if (action === `gestures`) {
      App.refresh_gestures()
    }
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
        App.set_setting({setting: key, value: el.checked, action: true})
      })

      DOM.ev(App.get_settings_label(key), `click`, (e) => {
        App.settings_label_menu(e,
          [
            {
              name: `Reset`, action: () => {
                App.set_default_setting(key, true)
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
      App.set_setting({setting: key, value: value, action: true})
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
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
            force: force,
          })
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
            force: force,
          })
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
      App.set_setting({setting: key, value: value, action: true})
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          App.set_default_setting(key, true)
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
            let force = App.check_setting_default(key) || App.check_setting_empty(key)

            App.show_confirm({
              message: `Reset setting?`,
              confirm_action: () => {
                App.set_default_setting(key, true)
                Addlist.update_count(`settings_${key}`)
              },
              force: force,
            })
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
      App.set_setting({setting: setting, value: opt.value, action: true})
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
            App.set_default_setting(setting, true)
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

  App.settings_categories = Object.keys(App.setting_catprops)

  App.check_refresh_settings_debouncer = App.create_debouncer(() => {
    App.do_check_refresh_settings()
  }, App.check_refresh_settings_delay)
}

App.refresh_settings = () => {
  App.apply_theme()
  App.refresh_gestures()
  App.setup_commands()
  App.fill_palette()
  App.build_tab_filters()
}

App.build_setting_cmds = () => {
  App.cmdlist = App.settings_commands()
  App.cmdlist_2 = App.settings_commands(false)
  App.filter_cmds = App.get_filter_cmds()
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

        if (catprops.setup) {
          catprops.setup()
        }

        let container = DOM.el(`#settings_${key}_container`)
        App.settings_gestures(container)
      },
    }))
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

  let container = DOM.create(`div`, `flex_row_center gap_2 grow`)
  top.append(container)
  let title = DOM.create(`div`, `settings_title button`)
  title.id = `settings_title_${category}`
  let icon = App.settings_icons[category]
  let text = App.category_string(category)
  title.append(App.button_text(icon, text))
  container.append(title)
  let actions = DOM.create(`div`, `button icon_button`)
  actions.id = `settings_actions_${category}`
  actions.append(App.get_svg_icon(`sun`))
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

  let prev = DOM.create(`div`, `button arrow_btn arrow_prev`)
  prev.textContent = `<`
  container.prepend(prev)

  DOM.ev(prev, `click`, () => {
    App.show_prev_settings()
  })

  let next = DOM.create(`div`, `button arrow_btn arrow_next`)
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

  let picker = AColorPicker.createPicker(el, {
    showAlpha: alpha,
    showHSL: false,
    showRGB: true,
    showHEX: true,
    color: App.get_setting(setting)
  })

  picker.on(`change`, (picker, color) => {
    let rgb

    if (alpha) {
      rgb = AColorPicker.parseColor(color, `rgbacss`)
    }
    else {
      rgb = AColorPicker.parseColor(color, `rgbcss`)
    }

    App.set_setting({setting: setting, value: rgb, action: true})
  })

  DOM.ev(App.get_settings_label(setting), `click`, (e) => {
    App.settings_label_menu(e,
      [
        {
          name: `Reset`, action: () => {
            picker.setColor(App.get_default_setting(setting))
            App.set_default_setting(setting, true)
          }
        },
      ])
  })
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
    setting: setting,
    value: App.default_setting_string,
    action: action
  })
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

App.restart_settings = () => {
  App.refresh_settings()

  if (App.on_settings()) {
    App.show_settings_category(`general`)
  }
  else {
    App.clear_show()
  }
}

App.settings_data_items = () => {
  let items = []

  items.push({
    icon: App.data_icon,
    text: `Export Settings`,
    action: () => {
      App.export_settings()
    }
  })

  items.push({
    icon: App.data_icon,
    text: `Import Settings`,
    action: () => {
      App.import_settings()
    }
  })

  items.push({
    icon: App.data_icon,
    text: `Reset Settings`,
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

App.set_setting = (args = {}) => {
  let def_args = {
    action: false,
  }

  App.def_args(def_args, args)

  if (App.str(App.settings[args.setting].value) !== App.str(args.value)) {
    let props = App.setting_props[args.setting]
    App.settings[args.setting].value = args.value
    let mirror = !props.no_mirror
    App.save_settings_debouncer.call(mirror)

    if (args.action) {
      let props = App.setting_props[args.setting]

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
  if (!mode) {
    return false
  }

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
    items.push({text: cmd.name, value: cmd.cmd, icon: cmd.icon, info: cmd.info})
  }

  return items
}

App.get_filter_cmds = () => {
  let items = []

  for (let cmd of App.commands) {
    if (cmd.filter_mode) {
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
    let props =  App.setting_catprops[c]

    items.push({
      icon: icon,
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

App.settings_actions = (category) => {
  let items = []

  items.push({
    text: `To Top`,
    action: () => {
      App.settings_top()
    }
  })

  items.push({
    text: `Bottom`,
    action: () => {
      App.settings_bottom()
    }
  })

  App.sep(items)

  items.push({
    text: `Reset`,
    action: () => {
      App.reset_settings(category)
    }
  })

  items.push({
    text: `Show All`,
    action: () => {
      App.show_all_settings()
    }
  })

  App.sep(items)

  items.push({
    icon: App.data_icon,
    text: `Data`,
    get_items: () => {
      return App.settings_data_items()
    }
  })

  let btn = DOM.el(`#settings_actions_${category}`)
  App.show_context({element: btn, items: items, expand: true, margin: btn.clientHeight})
}

App.show_all_settings = () => {
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
  App.show_textarea(`Settings (${n})`, lines.join(`\n`))
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
      el.title = App.tooltip(props.info)

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
  function cmd_icon (cmd) {
    let c = App.get_command(cmd)

    if (c) {
      return c.icon
    }
    else {
      return ``
    }
  }

  function cmd_name (cmd) {
    let c = App.get_command(cmd)

    if (c) {
      return c.name
    }
    else {
      return `None`
    }
  }

  let popobj, regobj = App.get_setting_addlist_objects()
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
        cmd: () => {
          return App.cmdlist_2.slice(0)
        },
        ctrl: () => {
          return true
        },
        shift: () => {
          return false
        },
        alt: () => {
          return false
        },
      },
      list_icon: (items) => {
        return cmd_icon(items.cmd)
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
    `empty_menu`,
    `footer_menu`,
    `pinline_menu`,
    `tabs_menu`,
    `history_menu`,
    `bookmarks_menu`,
    `closed_menu`,
    `main_title_menu`,
  ]

  for (let key in App.setting_props) {
    if (menukeys.includes(key)) {
      let id = `settings_${key}`
      let props = App.setting_props[key]

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
            cmd: () => {
              return App.cmdlist_2.slice(0)
            },
            alt: () => {
              return App.cmdlist.slice(0)
            },
          },
          list_icon: (items) => {
            return cmd_icon(items.cmd)
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

  menukeys = [
    `favorite_filters`,
    `refine_filters`,
  ]

  for (let key in App.setting_props) {
    if (menukeys.includes(key)) {
      let id = `settings_${key}`
      let props = App.setting_props[key]

      App.create_popup(Object.assign({}, popobj, {
        id: `addlist_${id}`,
        element: Addlist.register(Object.assign({}, regobj, {
          id: id,
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
              return App.filter_cmds.slice(0)
            },
          },
          list_icon: (items) => {
            return cmd_icon(items.cmd)
          },
          list_text: (items) => {
            return cmd_name(items.cmd)
          },
          title: props.name,
          automenu: true,
        }))
      }))
    }
  }

  App.start_domain_rules()

  id = `settings_colors`
  props = App.setting_props.colors

  App.create_popup(Object.assign({}, popobj, {
    id: `addlist_${id}`,
    element: Addlist.register(Object.assign({}, regobj, {
      id: id,
      keys: [`name`, `value`, `text`],
      pk: `name`,
      widgets: {
        name: `text`,
        value: `color`,
        text: `color`,
      },
      labels: {
        name: `Name`,
        value: `Value`,
        text: `Text`
      },
      list_icon: (items) => {
        return App.color_icon(items._id_)
      },
      list_text: (items) => {
        return items.name
      },
      required: {
        value: true,
      },
      title: props.name,
    }))
  }))
}

App.settings_build_category = (key) => {
  let cat = App.setting_catprops[key]
  let c = DOM.create(`div`, `settings_container`, `settings_${key}_container`)
  let info = DOM.create(`div`, `settings_info`)
  info.textContent = App.periods(cat.info)
  c.append(info)
  let sub = DOM.create(`div`, `settings_subcontainer`, `setting_${key}`)
  c.append(sub)
  return c
}

App.edit_text_setting = (key) => {
  let props = App.setting_props[key]
  let el = DOM.el(`#settings_${key}`)

  App.show_input({
    message: props.name,
    button: `Save`,
    action: (text) => {
      let value = text.trim()
      App.set_setting({setting: key, value: value, action: true})
      el.value = App.get_setting(key)
      App.scroll_to_top(el)
      return true
    },
    value: App.get_setting(key),
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
  let text_types = [`text`, `text_smaller`, `textarea`, `number`]

  if (text_types.includes(props.type)) {
    return value === ``
  }
  else if (props.type === `list`) {
    return App.str(value) === App.str([])
  }
}

App.get_setting_addlist_objects = () => {
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
    App.set_setting({setting: key, value: value, action: true})
  }

  let regobj = {
    get_data: get_data,
    set_data: set_data,
  }

  return popobj, regobj
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
  App.set_setting({setting: setting, value: !value, action: action})
}