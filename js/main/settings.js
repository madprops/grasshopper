App.settings_do_action = (what) => {
  if (what === `theme`) {
    App.apply_theme_2()
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
    let cls = `action underline`

    for (let btn of btns) {
      let c = DOM.create(`div`, `flex_row_center gap_1`)
      let d = DOM.create(`div`)
      d.textContent = `|`
      let a = DOM.create(`div`, cls)
      a.id = btn[0]
      a.textContent = btn[1]
      c.append(d)
      c.append(a)
      bc.append(c)
    }

    item.before(bc)
    bc.prepend(item)
  }

  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if ((props.category === category) && props.btns) {
      let btns = []

      if (props.btns.includes(`random`)) {
        btns.push([`settings_${key}_random`, App.random_text])
      }

      if (props.btns.includes(`view`)) {
        btns.push([`settings_${key}_view`, `View`])
      }

      if (props.btns.includes(`next`)) {
        btns.push([`settings_${key}_next`, `Next`])
      }

      if (props.btns.includes(`shuffle`)) {
        btns.push([`settings_${key}_shuffle`, `Shuffle`])
      }

      if (btns.length) {
        proc(DOM.el(`#settings_label_${key}`), btns)
      }
    }
  }
}

App.settings_setup_checkboxes = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if ((props.category === category) && props.type === `checkbox`) {
      let el = DOM.el(`#settings_${key}`)
      el.checked = App.get_setting(key)

      DOM.ev(el, `change`, () => {
        App.set_setting(key, el.checked)
      })

      DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
        App.settings_label_menu(e,
        [
          {
            name: `Reset`, action: () => {
              let force = App.check_setting_default(key)

              App.show_confirm(`Reset setting?`, () => {
                App.set_default_setting(key)
                el.checked = App.get_setting(key)
              }, undefined, force)
            }
          },
        ])
      })
    }
  }
}

App.settings_setup_text = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category !== category) {
      continue
    }

    if (props.type !== `text` && props.type !== `text_smaller`) {
      continue
    }

    let el = DOM.el(`#settings_${key}`)
    let value = App.get_setting(key)
    el.value = value

    DOM.ev(el, `change`, () => {
      App.scroll_to_top(el)
      App.do_save_text_setting(key, el)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          let force = App.check_setting_default(key)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(key)
            el.value = App.get_setting(key)
            App.scroll_to_top(el)
          }, undefined, force)
        },
      },
      {
        name: `Clear`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.show_confirm(`Clear setting?`, () => {
            el.value = ``
            App.set_setting(key, ``)
            el.focus()
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

    DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
      App.settings_label_menu(e, menu)
    })
  }
}

App.settings_setup_number = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

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

      if (el.min) {
        let min = parseInt(el.min)

        if (value < min) {
          value = min
          el.value = value
        }
      }

      if (isNaN(value)) {
        return
      }

      App.set_setting(key, value)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          let force = App.check_setting_default(key)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(key)
            let value = App.get_setting(key)
            el.value = value
          }, undefined, force)
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

    DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
      App.settings_label_menu(e, menu)
    })
  }
}

App.add_settings_addlist = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category === category) {
      if (props.type !== `list`) {
        continue
      }

      App.addlist_add_buttons(`settings_${key}`)

      let menu = [
        {
          name: `Reset`,  action: () => {
            let force = App.check_setting_default(key)

            App.show_confirm(`Reset setting?`, () => {
              App.set_default_setting(key)
            }, undefined, force)
          },
        },
      ]

      DOM.evs(App.get_settings_label(key), [`click`, `contextmenu`], (e) => {
        App.settings_label_menu(e, menu)
      })
    }
  }
}

App.settings_make_menu = (setting, opts, action = () => {}) => {
  let no_wrap = [`font_size`, `width`, `height`]

  App[`settings_menubutton_${setting}`] = App.create_menubutton({
    opts: opts,
    button: DOM.el(`#settings_${setting}`),
    selected: App.get_setting(setting),
    wrap: !no_wrap.includes(setting),
    on_change: (args, opt) => {
      App.set_setting(setting, opt.value)
      action()
    },
  })

  DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          let force = App.check_setting_default(setting)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(setting)
            App.set_settings_menu(setting)
            action()
          }, undefined, force)
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

  filter.placeholder = `Filter${s}`
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
  App.settings_categories = [`general`, `theme`, `media`, `icons`, `show`, `gestures`, `auxclick`, `menus`, `keyboard`, `warns`, `colors`, `more`]

  let common = {
    persistent: false,
    colored_top: true,
    after_show: () => {
      DOM.el(`#settings_${App.settings_category}_filter`).focus()
    },
    on_hide: async () => {
      App.apply_theme_2()
      App.clear_show()
    },
  }

  function prepare (category) {
    App.fill_settings(category)
    App.settings_setup_checkboxes(category)
    App.settings_setup_text(category)
    App.settings_setup_number(category)
    App.add_settings_addlist(category)
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
      el.classList.add(`action`)
    }
  }

  App.create_window(Object.assign({}, common, {id: `settings_general`, setup: () => {
    prepare(`general`)

    App.settings_make_menu(`text_mode`, [
      {text: `Title`, value: `title`},
      {text: `URL`, value: `url`},
      {text: `Title / URL`, value: `title_url`},
      {text: `URL / Title`, value: `url_title`},
    ])

    App.settings_make_menu(`font`, [
      {text: `Sans`, value: `sans-serif`},
      {text: `Serif`, value: `serif`},
      {text: `Mono`, value: `monospace`},
      {text: `Cursive`, value: `cursive`},
    ], () => {
      App.apply_theme_2()
    })

    App.settings_make_menu(`auto_restore`, [
      {text: `Never`, value: `never`},
      {text: `1 Second`, value: `1_seconds`},
      {text: `5 Seconds`, value: `5_seconds`},
      {text: `10 Seconds`, value: `10_seconds`},
      {text: `30 Seconds`, value: `30_seconds`},
      {text: `On Action`, value: `action`},
    ], () => {
      clearTimeout(App.restore_timeout)
    })

    App.settings_make_menu(`font_size`, App.get_font_size_options(), () => {
      App.apply_theme_2()
    })

    App.settings_make_menu(`item_height`, [
      {text: `Compact`, value: `compact`},
      {text: `Normal`, value: `normal`},
      {text: `Bigger`, value: `bigger`},
      {text: `Huge`, value: `huge`},
    ])

    App.settings_make_menu(`item_border`, [
      {text: `None`, value: `none`},
      {text: `Normal`, value: `normal`},
      {text: `Bigger`, value: `bigger`},
      {text: `Huge`, value: `huge`},
    ])

    App.settings_make_menu(`pick_mode`, [
      {text: `None`, value: `none`},
      {text: `Smart`, value: `smart`},
      {text: `Single`, value: `single`},
      {text: `Simple`, value: `simple`},
    ])

    App.settings_make_menu(`favicon_source`, [
      {text: `None`, value: `none`},
      {text: `Google`, value: `google`},
      {text: `4get`, value: `4get`},
    ])

    App.settings_make_menu(`primary_mode`, [
      {text: `Tabs`, value: `tabs`},
      {text: `History`, value: `history`},
      {text: `Bookmarks`, value: `bookmarks`},
      {text: `Closed`, value: `closed`},
    ])

    App.settings_make_menu(`width`, App.get_size_options(), () => {
      App.apply_theme_2()
    })

    App.settings_make_menu(`height`, App.get_size_options(), () => {
      App.apply_theme_2()
    })
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_theme`, setup: () => {
    prepare(`theme`)
    App.start_theme_settings()
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_colors`, setup: () => {
    prepare(`colors`)
    for (let color of App.colors) {
      App.start_color_picker(`color_${color}`, true)
    }

    App.settings_make_menu(`color_mode`, [
      {text: `None`, value: `none`},
      {text: `Icon`, value: `icon`},
      {text: `Icon 2`, value: `icon_2`},
      {text: `Item`, value: `item`},
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_warns`, setup: () => {
    prepare(`warns`)
    App.settings_make_menu(`warn_on_close_tabs`, App.tab_warn_opts)
    App.settings_make_menu(`warn_on_unload_tabs`, App.tab_warn_opts)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_more`, setup: () => {
    prepare(`more`)
    App.settings_make_menu(`hover_effect`, App.effects)
    App.settings_make_menu(`selected_effect`, App.effects)
    App.settings_make_menu(`double_click_command`, App.settings_commands())
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_media`, setup: () => {
    prepare(`media`)

    let opts = [
      {text: `Never`, value: `never`},
      {text: `On Icon Click`, value: `icon`},
      {text: `On Item Click`, value: `item`},
    ]

    for (let m of App.modes) {
      App.settings_make_menu(`view_image_${m}`, opts)
      App.settings_make_menu(`view_video_${m}`, opts)
      App.settings_make_menu(`view_audio_${m}`, opts)
    }
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_icons`, setup: () => {
    prepare(`icons`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_show`, setup: () => {
    prepare(`show`)

    App.settings_make_menu(`show_pinline`, [
      {text: `Never`, value: `never`},
      {text: `Normal`, value: `normal`},
      {text: `Always`, value: `always`},
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_gestures`, setup: () => {
    prepare(`gestures`)

    DOM.ev(DOM.el(`#settings_gestures_enabled`), `change`, () => {
      App.refresh_gestures()
    })

    App.settings_make_menu(`gestures_threshold`, [
      {text: `Normal`, value: 10},
      {text: `Less Sensitive`, value: 100},
    ], () => {
      App.refresh_gestures()
    })

    let opts = App.settings_commands()

    for (let key in App.settings_props) {
      let props = App.settings_props[key]

      if (props.category === `gestures`) {
        if (key.startsWith(`gesture_`)) {
          App.settings_make_menu(key, opts)
        }
      }
    }
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_auxclick`, setup: () => {
    prepare(`auxclick`)
    let opts = App.settings_commands()

    for (let key in App.settings_props) {
      let props = App.settings_props[key]

      if (props.category === `auxclick`) {
        App.settings_make_menu(key, opts)
      }
    }
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_menus`, setup: () => {
    prepare(`menus`)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_keyboard`, setup: () => {
    prepare(`keyboard`)
  }}))

  window.addEventListener(`storage`, (e) => {
    if (e.key === App.stor_settings_name) {
      App.debug(`Settings changed in another window`)
      App.stor_get_settings()
      App.restart_settings(`sync`)
    }
  })
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
  title.textContent = App.capitalize(category)
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

  DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
    App.settings_label_menu(e,
    [
      {
        name: `Reset`, action: () => {
          let force = App.check_setting_default(setting)

          App.show_confirm(`Reset setting?`, () => {
            App[setting].setColor(App.get_default_setting(setting))
            App.set_default_setting(setting)
          }, undefined, force)
        }
      },
    ])
  })
}

App.start_theme_settings = () => {
  App.start_color_picker(`background_color`)
  App.start_color_picker(`text_color`)

  App.settings_make_menu(`background_effect`, App.background_effects, () => {
    App.apply_theme_2()
  })

  App.settings_make_menu(`background_tiles`, App.background_tiles, () => {
    App.apply_theme_2()
  })

  let auto_opts = [
    {text: `Never`, value: `never`},
    {text: `1 minute`, value: `1_minutes`},
    {text: `5 minutes`, value: `5_minutes`},
    {text: `30 minutes`, value: `30_minutes`},
    {text: `1 hour`, value: `1_hours`},
    {text: `6 hours`, value: `6_hours`},
    {text: `12 hours`, value: `12_hours`},
    {text: `24 hours`, value: `24_hours`},
  ]

  let color_opts = [...auto_opts]
  color_opts.push({text: `Domain`, value: `domain`})
  color_opts.push({text: `Party`, value: `party`})

  App.settings_make_menu(`auto_colors`, color_opts, () => {
    App.start_theme_interval(`auto_colors`)
  })

  App.settings_make_menu(`auto_background`, auto_opts, () => {
    App.start_theme_interval(`auto_background`)
  })

  App.settings_make_menu(`auto_background_mode`, [
    {text: `Only Pool`, value: `pool`},
    {text: `Only Random`, value: `random`},
    {text: `Pool & Random`, value: `pool_random`},
  ])

  App.settings_make_menu(`random_colors`, [
    {text: `Only Dark`, value: `dark`},
    {text: `Only Light`, value: `light`},
    {text: `Dark & Light`, value: `both`},
  ], () => {
    App.hostname_colors = {}
  })

  DOM.ev(DOM.el(`#settings_background_color_random`), `click`, () => {
    App.random_settings_color(`background`)
  })

  DOM.ev(DOM.el(`#settings_text_color_random`), `click`, () => {
    App.random_settings_color(`text`)
  })

  DOM.ev(DOM.el(`#settings_background_image_random`), `click`, () => {
    App.random_background()
  })

  DOM.ev(DOM.el(`#settings_background_pool_next`), `click`, () => {
    App.background_from_pool()
  })

  DOM.ev(DOM.el(`#settings_background_pool_shuffle`), `click`, () => {
    App.shuffle_addlist(`background_pool`)
  })

  DOM.ev(DOM.el(`#settings_background_pool_view`), `click`, () => {
    let items = {
      url: App.get_setting(`background_image`),
      effect: App.get_setting(`background_effect`),
      tiles: App.get_setting(`background_tiles`),
    }
  })
}

App.settings_default_category = (category) => {
  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category === category) {
      App.set_default_setting(key, false)
    }
  }
}

App.set_default_setting = (setting, do_action) => {
  App.set_setting(setting, App.default_setting_string, do_action)
}

App.reset_settings = (category) => {
  App.show_confirm(`Reset settings? (${App.capitalize(category)})`, () => {
    App.settings_default_category(category)

    if (category === `gestures`) {
      App.refresh_gestures()
    }

    App.apply_theme_2()
    App.show_settings_category(category)
  })
}

App.reset_all_settings = () => {
  App.show_confirm(`Reset all settings?`, () => {
    for (let key in App.settings_props) {
      App.set_default_setting(key)
    }

    App.restart_settings()
  })
}

App.get_font_size_options = () => {
  let opts = []

  for (let i=12; i<=22; i++) {
    opts.push({text: `${i} px`, value: i})
  }

  return opts
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

App.show_settings_category = (category) => {
  App.check_settings_addlist()
  App.settings_category = category
  App.show_window(`settings_${category}`)
  App.set_default_theme()
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

App.show_settings_menu = () => {
  let category = App.settings_category
  let btn = DOM.el(`#settings_title_${category}`)
  let items = App.settings_menu_items()
  NeedContext.show_on_element(btn, items)
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
  App.apply_theme_2()
  App.refresh_gestures()

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
    value = App.get_default_setting(setting)
  }

  return value
}

App.set_setting = (setting, value, do_action = true) => {
  if (App.str(App.settings[setting].value) !== App.str(value)) {
    App.settings[setting].value = value
    App.save_settings_debouncer.call()

    if (do_action) {
      let props = App.settings_props[setting]

      if (props.action) {
        App.settings_do_action(props.action)
      }
    }
  }
}

App.get_default_setting = (setting) => {
  let value = App.settings_props[setting].value

  if (typeof value === `object`) {
    value = [...value]
  }

  return value
}

App.save_settings_debouncer = App.create_debouncer(() => {
  App.stor_save_settings()
}, App.settings_save_delay)

App.check_settings = () => {
  let changed = false

  function set_default (setting) {
    App.settings[setting].value = App.default_setting_string
    App.settings[setting].version = App.settings_props[setting].version
  }

  for (let key in App.settings_props) {
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
    if (App.settings_props[key] === undefined) {
      App.debug(`Stor: Deleting setting: ${key}`)
      delete App.settings[key]
      changed = true
    }
    // Check new version
    else if (App.settings[key].version !== App.settings_props[key].version) {
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

App.settings_commands = () => {
  let items = [
    {text: `Do Nothing`, value: `none`},
    {text: App.separator_string},
  ]

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

App.tab_warn_opts = [
  {text: `Never`, value: `never`},
  {text: `Always`, value: `always`},
  {text: `Special`, value: `special`},
]

App.settings_menu_items = () => {
  let items = []

  for (let c of App.settings_categories) {
    let icon = App.settings_icons[c]
    let name = App.capitalize(c)

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

App.is_default_setting = (setting) => {
  return (App.settings[setting].value === App.default_setting_string) ||
  (App.str(App.settings[setting].value) === App.str(App.get_default_setting(setting)))
}

App.check_setting_default = (setting) => {
  return App.is_default_setting(setting)
}

App.set_settings_menu = (setting, value, on_change) => {
  if (!value) {
    value = App.get_setting(setting)
  }

  App[`settings_menubutton_${setting}`].set(value, on_change)
}

App.apply_background = (bg) => {
  App.change_background(bg.url, bg.effect, bg.tiles)
}

App.do_save_text_setting = (setting, el) => {
  let value = el.value.trim()
  el.value = value
  el.scrollTop = 0
  App.set_setting(setting, value)
}

App.shuffle_addlist = (setting) => {
  App.show_confirm(`Shuffle items?`, () => {
    let items = App.get_setting(setting)
    App.shuffle_array(items)
    App.set_setting(setting, items)
    App.check_theme_refresh()
  })
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
  NeedContext.show_on_element(btn, items, true, btn.clientHeight)
}

App.get_background_effect = (value) => {
  for (let key in App.background_effects) {
    let eff = App.background_effects[key]

    if (eff.value === value) {
      return eff
    }
  }
}

App.fill_settings = (category) => {
  let c = DOM.el(`#setting_${category}`)
  c.innerHTML = ``

  for (let key in App.settings_props) {
    let props = App.settings_props[key]

    if (props.category === category) {
      let el = DOM.create(`div`, `settings_item`)
      let label = DOM.create(`div`, `settings_label`)
      label.id = `settings_label_${key}`
      label.textContent = props.name
      el.append(label)
      let widget

      if (props.type === `menu`) {
        widget = DOM.create(`div`, `settings_menu button`)
      }
      else if (props.type === `list`) {
        widget = DOM.create(`div`, `settings_addlist`)
      }
      else if (props.type === `text`) {
        widget = DOM.create(`input`, `text settings_text`)
        widget.type = `text`
        widget.autocomplete = `off`
        widget.spellcheck = `false`
        widget.placeholder = props.placeholder
      }
      else if (props.type === `text_smaller`) {
        widget = DOM.create(`input`, `text settings_text text_smaller`)
        widget.type = `text`
        widget.autocomplete = `off`
        widget.spellcheck = `false`
        widget.placeholder = props.placeholder
      }
      else if (props.type === `number`) {
        widget = DOM.create(`input`, `text settings_number`)
        widget.type = `number`
        widget.autocomplete = `off`
        widget.spellcheck = `false`
        widget.placeholder = props.placeholder
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
      el.title = props.info
      c.append(el)
    }
  }
}

App.check_settings_addlist = () => {
  if (!App.settings_addlist_ready) {
    App.setup_settings_addlist()
    App.settings_addlist_ready = true
  }
}

App.setup_settings_addlist = () => {
  App.addlist_commands = App.settings_commands()

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
    App.hide_addlist()
  }

  function after_hide () {
    App.addlist_clear_image()
  }

  let args = {
    on_hide: on_hide,
    after_hide: after_hide,
  }

  let from = `settings`
  let id = `settings_aliases`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `a`,
      widgets: [`text`, `text`],
      labels: [`Term A`, `Term B`],
      keys: [`a`, `b`],
      list_text: (items) => {
        return `${items.a} = ${items.b}`
      }
    })
  }))

  id = `settings_custom_filters`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `filter`,
      widgets: [`text`],
      labels: [`Filter`],
      keys: [`filter`],
      list_text: (items) => {
        return items.filter
      }
    })
  }))

  id = `settings_background_pool`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `url`,
      widgets: [`text`, `select`, `select`],
      labels: [`Image URL`, `Effect`, `Tiles`],
      image: 0,
      sources: [undefined, App.background_effects, App.background_tiles],
      keys: [`url`, `effect`, `tiles`],
      list_text: (items) => {
        let s = App.remove_protocol(items.url)

        if (items.effect !== `none`) {
          let eff = App.get_background_effect(items.effect)

          if (eff) {
            s += ` (${eff.text})`
          }
        }

        if (items.tiles !== `none`) {
          s += ` (Tiled)`
        }

        return s
      }
    })
  }))

  id = `settings_keyboard_shortcuts`

  App.create_popup(Object.assign({}, args, {
    id: `addlist_${id}`,
    element: App.addlist_register({
      from: from,
      id: id,
      pk: `key`,
      widgets: [`key`, `select`, `checkbox`, `checkbox`, `checkbox`],
      labels: [`Key`, `Command`, `Require Ctrl`, `Require Shift`, `Require Alt`],
      sources: [undefined, App.addlist_commands.slice(0), true, false, false],
      keys: [`key`, `cmd`, `ctrl`, `shift`, `alt`],
      list_text: (items) => {
        let cmd = cmd_name(items.cmd)
        return `${items.key} = ${cmd}`
      }
    })
  }))

  for (let key in App.settings_props) {
    let props = App.settings_props[key]
    let id = `settings_${key}`

    if (props.category === `menus`) {
      App.create_popup(Object.assign({}, args, {
        id: `addlist_${id}`,
        element: App.addlist_register({
          from: from,
          id: id,
          pk: `cmd`,
          widgets: [`select`], labels: [`Command`],
          sources: [App.addlist_commands.slice(0)],
          keys: [`cmd`], list_text: (items) => {
            return cmd_name(items.cmd)
          }
        })
      }))
    }
  }
}