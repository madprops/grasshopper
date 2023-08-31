App.build_default_settings = () => {
  let obj = {}

  let category = `general`
  obj.tabs_index = {value: 0, category: category, version: 1}
  obj.history_index = {value: 1, category: category, version: 1}
  obj.bookmarks_index = {value: 2, category: category, version: 1}
  obj.closed_index = {value: 3, category: category, version: 1}
  obj.text_mode = {value: `title`, category: category, version: 1}
  obj.item_height = {value: `normal`, category: category, version: 1}
  obj.font = {value: `sans-serif`, category: category, version: 1}
  obj.font_size = {value: 16, category: category, version: 1}
  obj.favicon_source = {value: `none`, category: category, version: 1}
  obj.width = {value: 75, category: category, version: 1}
  obj.height = {value: 85, category: category, version: 1}
  obj.item_border = {value: `none`, category: category, version: 2}
  obj.pick_mode = {value: `none`, category: category, version: 1}
  obj.wrap_text = {value: false, category: category, version: 1}
  obj.auto_restore = {value: `10_seconds`, category: category, version: 1}
  obj.bookmarks_folder = {value: `Grasshopper`, category: category, version: 1}
  obj.aliases = {value: [
    `big ; huge`,
    `quick ; fast`,
    `planet ; earth`,
    `locust ; grasshopper`
  ], category: category, version: 1}
  obj.custom_filters = {value: [
    `re: (today | $day)`,
    `re: ($month | $year)`,
    `re: \\d{2}\\/\\d{2}\\/\\d{4}`,
    `re: (youtu|twitch)`,
  ], category: category, version: 1}

  category = `theme`
  obj.background_color = {value: `rgb(45, 45, 55)`, category: category, version: 1}
  obj.text_color = {value: `rgb(233, 233, 233)`, category: category, version: 1}
  obj.background_image = {value: `waves.jpg`, category: category, version: 1}
  obj.background_effect = {value: `none`, category: category, version: 1}
  obj.background_tiles = {value: `none`, category: category, version: 1}
  obj.auto_theme = {value: `never`, category: category, version: 3}
  obj.auto_background = {value: `never`, category: category, version: 3}
  obj.auto_background_mode = {value: `pool`, category: category, version: 1}
  obj.color_transitions = {value: true, category: category, version: 1}
  obj.background_transitions = {value: true, category: category, version: 1}
  obj.random_background_gifs = {value: true, category: category, version: 1}
  obj.random_themes = {value: `dark`, category: category, version: 1}
  obj.background_pool = {value: App.default_backgrounds(), category: category, version: 1}

  category = `media`
  obj.view_image_tabs = {value: `icon`, category: category, version: 1}
  obj.view_video_tabs = {value: `icon`, category: category, version: 1}
  obj.view_audio_tabs = {value: `icon`, category: category, version: 1}
  obj.view_image_history = {value: `icon`, category: category, version: 1}
  obj.view_video_history = {value: `icon`, category: category, version: 1}
  obj.view_audio_history = {value: `icon`, category: category, version: 1}
  obj.view_image_bookmarks = {value: `icon`, category: category, version: 1}
  obj.view_video_bookmarks = {value: `icon`, category: category, version: 1}
  obj.view_audio_bookmarks = {value: `icon`, category: category, version: 1}
  obj.view_image_closed = {value: `icon`, category: category, version: 1}
  obj.view_video_closed = {value: `icon`, category: category, version: 1}
  obj.view_audio_closed = {value: `icon`, category: category, version: 1}
  obj.image_icon = {value: `🖼️`, category: category, version: 1}
  obj.video_icon = {value: `▶️`, category: category, version: 1}
  obj.audio_icon = {value: `🎵`, category: category, version: 1}

  category = `show`
  obj.pin_icon = {value: `+`, category: category, version: 1}
  obj.normal_icon = {value: ``, category: category, version: 1}
  obj.playing_icon = {value: `🔊`, category: category, version: 1}
  obj.muted_icon = {value: `🔇`, category: category, version: 1}
  obj.unloaded_icon = {value: `💤`, category: category, version: 1}
  obj.close_icon = {value: `x`, category: category, version: 1}
  obj.open_icon = {value: `🚀`, category: category, version: 1}
  obj.pick_icon = {value: `🎯`, category: category, version: 1}
  obj.show_scrollbars = {value: true, category: category, version: 1}
  obj.show_tooltips = {value: true, category: category, version: 1}
  obj.show_icons = {value: true, category: category, version: 1}
  obj.show_pinline = {value: true, category: category, version: 1}
  obj.show_scroller = {value: true, category: category, version: 1}
  obj.show_footer = {value: true, category: category, version: 1}
  obj.show_filter_history = {value: true, category: category, version: 1}

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
  obj.middle_click_footer = {value: `copy_url`, category: category, version: 1}
  obj.middle_click_pick_button = {value: `filter_domain`, category: category, version: 1}
  obj.middle_click_close_button = {value: `unload_single`, category: category, version: 1}
  obj.middle_click_open_button = {value: `open`, category: category, version: 1}
  obj.middle_click_pinline = {value: `close_normal`, category: category, version: 1}
  obj.extra_menu = {value: [], category: category, version: 1}
  obj.empty_menu = {value: [`Select ; select_all`, `New Tab ; new_tab`, ], category: category, version: 1}
  obj.footer_menu = {value: [`Copy URL ; copy_url`, `Copy Title ; copy_title`, ], category: category, version: 1}

  category = `warns`
  obj.warn_on_close_tabs = {value: `special`, category: category, version: 1}
  obj.warn_on_unload_tabs = {value: `special`, category: category, version: 1}
  obj.warn_on_duplicate_tabs = {value: true, category: category, version: 1}
  obj.warn_on_close_normal_tabs = {value: true, category: category, version: 1}
  obj.warn_on_close_unloaded_tabs = {value: true, category: category, version: 1}
  obj.warn_on_close_duplicate_tabs = {value: true, category: category, version: 1}
  obj.warn_on_close_visible_tabs = {value: true, category: category, version: 1}
  obj.warn_on_open = {value: true, category: category, version: 1}
  obj.warn_on_remove_profiles = {value: true, category: category, version: 1}
  obj.warn_on_bookmark = {value: true, category: category, version: 1}

  category = `colors`
  obj.color_red = {value: `rgba(172, 59, 59, 0.44)`, category: category, version: 1}
  obj.color_green = {value: `rgba(46, 104, 46, 0.44)`, category: category, version: 1}
  obj.color_blue = {value: `rgba(59, 59, 147, 0.44)`, category: category, version: 1}
  obj.color_yellow = {value: `rgba(128, 128, 41, 0.44)`, category: category, version: 1}
  obj.color_purple = {value: `rgba(124, 35, 166, 0.44)`, category: category, version: 1}
  obj.color_orange = {value: `rgba(170, 127, 59, 0.44)`, category: category, version: 1}
  obj.color_mode = {value: `item`, category: category, version: 1}

  category = `more`
  obj.single_new_tab = {value: true, category: category, version: 1}
  obj.close_on_focus = {value: true, category: category, version: 1}
  obj.close_on_open = {value: true, category: category, version: 1}
  obj.case_insensitive = {value: true, category: category, version: 1}
  obj.lock_drag = {value: false, category: category, version: 1}
  obj.mute_click = {value: true, category: category, version: 1}
  obj.double_click_new = {value: true, category: category, version: 1}
  obj.rounded_corners = {value: true, category: category, version: 1}
  obj.hover_effect = {value: `glow`, category: category, version: 1}
  obj.direct_settings = {value: true, category: category, version: 1}
  obj.debug_mode = {value: false, category: category, version: 1}
  obj.selected_effect = {value: `background`, category: category, version: 1}
  obj.double_click_action = {value: false, category: category, version: 1}
  obj.smooth_scrolling = {value: true, category: category, version: 1}
  obj.sort_commands = {value: true, category: category, version: 1}
  obj.all_bookmarks = {value: true, category: category, version: 1}

  App.default_settings = obj
}

App.settings_do_action = (what) => {
  if (what === `theme`) {
    App.apply_theme()
  }
  else if (what === `hostname_colors`) {
    App.hostname_colors = {}
  }
  else if (what === `commands`) {
    App.sort_commands()
    App.fill_palette()
  }
}

App.get_settings_label = (setting) => {
  let item = DOM.el(`#settings_${setting}`)
  let container = item.closest(`.settings_item`)
  let label = DOM.el(`.settings_label`, container)
  return label
}

App.settings_setup_labels = (container) => {
  let items = DOM.els(`.settings_label`, container)

  function proc (item, btns) {
    let bc = DOM.create(`div`, `flex_row_center gap_1`)

    for (let btn of btns) {
      let c = DOM.create(`div`, `flex_row_center gap_1`)
      let d = DOM.create(`div`)
      d.textContent = `|`
      let a = DOM.create(`div`, `action`)
      a.id = btn[0]
      a.textContent = btn[1]
      a.title = btn[2]
      c.append(d)
      c.append(a)
      bc.append(c)
    }

    item.before(bc)
    bc.prepend(item)
  }

  for (let item of items) {
    let btns = []

    if (item.dataset.add) {
      btns.push([`settings_${item.dataset.id}_add`, `Add`, item.dataset.add])
    }

    if (item.dataset.rand) {
      btns.push([`settings_${item.dataset.id}_random`, App.random_text, item.dataset.rand])
    }

    if (item.dataset.next) {
      btns.push([`settings_${item.dataset.id}_next`, `Next`, item.dataset.next])
    }

    if (item.dataset.shuffle) {
      btns.push([`settings_${item.dataset.id}_shuffle`, App.shuffle_icon, item.dataset.shuffle])
    }

    if (btns.length > 0) {
      proc(item, btns)
    }
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

    DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
      App.settings_label_menu(e,
      [
        {
          name: `Reset`, action: () => {
            let force = App.check_setting_default(setting)

            App.show_confirm(`Reset setting?`, () => {
              App.set_default_setting(setting)
              el.checked = App.get_setting(setting)
              App.settings_do_action(action)
            }, undefined, force)
          }
        },
      ])
    })
  }
}

App.settings_setup_text = (container) => {
  let els = DOM.els(`.settings_text`, container)
  els.push(...DOM.els(`.settings_textarea`, container))

  for (let el of els) {
    let setting = el.dataset.setting
    let action = el.dataset.action
    let is_textarea = el.classList.contains(`settings_textarea`)
    let value = App.get_setting(setting)

    if (is_textarea) {
      value = App.get_textarea_setting_value(setting)
    }

    el.value = value

    DOM.ev(el, `focus`, () => {
      DOM.dataset(el, `modified`, false)
    })

    DOM.ev(el, `input`, () => {
      DOM.dataset(el, `modified`, true)
    })

    DOM.ev(el, `blur`, () => {
      if (!DOM.dataset(el, `modified`)) {
        return
      }

      App.scroll_to_top(el)
      App.do_save_text_setting(setting, el)
    })

    let menu = [
      {
        name: `Reset`,  action: () => {
          let force = App.check_setting_default(setting)

          App.show_confirm(`Reset setting?`, () => {
            App.set_default_setting(setting)
            let value = App.get_setting(setting)

            if (is_textarea) {
              el.value = value.join(`\n`)
            }
            else {
              el.value = value
            }

            App.scroll_to_top(el)
            App.settings_do_action(action)
          }, undefined, force)
        },
      },
      {
        name: `Clear`,  action: () => {
          if (el.value === ``) {
            return
          }

          App.show_confirm(`Clear setting?`, () => {
            if (is_textarea) {
              App.set_setting(setting, [])
            }
            else {
              App.set_setting(setting, ``)
            }

            el.value = ``
            App.settings_do_action(action)
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

    if (is_textarea) {
      menu.push({
        name: `Edit`,  action: () => {
          App.edit_setting(setting)
        },
      })
    }

    DOM.evs(App.get_settings_label(setting), [`click`, `contextmenu`], (e) => {
      App.settings_label_menu(e, menu)
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
        icon: o[2],
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

  App[`settings_${setting}_opts`] = opts

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
  App.settings_categories = [`general`, `theme`, `media`, `show`, `mouse`, `warns`, `colors`, `more`]

  let common = {
    persistent: false,
    colored_top: true,
    after_show: () => {
      DOM.el(`#settings_${App.settings_category}_filter`).focus()
    },
    on_hide: async () => {
      App.apply_theme()
      App.clear_show()
    },
  }

  function prepare (category) {
    let container = DOM.el(`#settings_${category}_container`)
    App.settings_setup_labels(container)
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

    App.settings_make_menu(`auto_restore`, [
      [`Never`, `never`],
      [`1 Second`, `1_seconds`],
      [`5 Seconds`, `5_seconds`],
      [`10 Seconds`, `10_seconds`],
      [`30 Seconds`, `30_seconds`],
      [`On Action`, `action`],
    ], () => {
      clearTimeout(App.restore_timeout)
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
      [`Huge`, `huge`],
    ])

    App.settings_make_menu(`pick_mode`, [
      [`None`, `none`],
      [`Smart`, `smart`],
      [`Single`, `single`],
      [`Simple`, `simple`],
    ])

    App.settings_make_menu(`favicon_source`, [
      [`None`, `none`],
      [`Google`, `google`],
      [`4get`, `4get`],
    ])

    App.settings_make_menu(`width`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.settings_make_menu(`height`, App.get_size_options(), () => {
      App.apply_theme()
    })

    App.make_mode_order()

    DOM.evs(App.get_settings_label(`mode_order`), [`click`, `contextmenu`], (e) => {
      App.settings_label_menu(e,
      [
        {
          name: `Reset`, action: () => {
            let force = App.check_setting_default(`mode_order`)

            App.show_confirm(`Reset setting?`, () => {
              App.set_default_setting(`tabs_index`)
              App.set_default_setting(`history_index`)
              App.set_default_setting(`bookmarks_index`)
              App.set_default_setting(`closed_index`)
              App.get_mode_order()
              App.make_mode_order()
            }, undefined, force)
          }
        },
      ])
    })

    DOM.ev(DOM.el(`#settings_aliases_add`), `click`, () => {
      App.addlist({id: `alias`})
    })

    DOM.ev(DOM.el(`#settings_aliases`), `click`, (e) => {
      App.addlist_click({e: e, id: `alias`})
    })

    DOM.ev(DOM.el(`#settings_custom_filters_add`), `click`, () => {
      App.addlist({id: `custom_filter`})
    })

    DOM.ev(DOM.el(`#settings_custom_filters`), `click`, (e) => {
      App.addlist_click({e: e, id: `custom_filter`})
    })
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_theme`, setup: () => {
    prepare(`theme`)
    App.start_theme_settings()
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_colors`, setup: () => {
    let container = DOM.el(`#settings_colors_container`)

    for (let color of App.colors) {
      let el = DOM.create(`div`, `settings_item`)
      el.title = `What color to use for ${color}`
      let label = DOM.create(`div`, `settings_label`)
      label.textContent = `Color ${App.capitalize(color)}`
      let picker = DOM.create(`div`, undefined, `settings_color_${color}`)
      picker.dataset.setting = `color_${color}`
      el.append(label)
      el.append(picker)
      container.append(el)
      App.start_color_picker(`color_${color}`, true)
    }

    prepare(`colors`)

    App.settings_make_menu(`color_mode`, [
      [`None`, `none`],
      [`Icon`, `icon`],
      [`Icon 2`, `icon_2`],
      [`Item`, `item`],
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_warns`, setup: () => {
    prepare(`warns`)
    App.settings_make_menu(`warn_on_close_tabs`, App.tab_warn_opts)
    App.settings_make_menu(`warn_on_unload_tabs`, App.tab_warn_opts)
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_more`, setup: () => {
    prepare(`more`)

    App.settings_make_menu(`hover_effect`, [
      [`None`, `none`],
      [`Glow`, `glow`],
      [`Underline`, `underline`],
      [`Bold`, `bold`],
      [`Bigger`, `bigger`],
    ])

    App.settings_make_menu(`selected_effect`, [
      [`None`, `none`],
      [`Background`, `background`],
      [`Underline`, `underline`],
      [`Bold`, `bold`],
      [`Bigger`, `bigger`],
    ])
  }}))

  App.create_window(Object.assign({}, common, {id: `settings_media`, setup: () => {
    prepare(`media`)

    let opts = [
      [`Never`, `never`],
      [`On Icon Click`, `icon`],
      [`On Item Click`, `item`],
    ]

    for (let m of App.modes) {
      App.settings_make_menu(`view_image_${m}`, opts)
      App.settings_make_menu(`view_video_${m}`, opts)
      App.settings_make_menu(`view_audio_${m}`, opts)
    }
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
      App.settings_make_menu(`gesture_${gesture}`, opts)
    }

    App.settings_make_menu(`middle_click_main_menu`, opts)
    App.settings_make_menu(`middle_click_filter_menu`, opts)
    App.settings_make_menu(`middle_click_back_button`, opts)
    App.settings_make_menu(`middle_click_actions_menu`, opts)
    App.settings_make_menu(`middle_click_footer`, opts)
    App.settings_make_menu(`middle_click_pick_button`, opts)
    App.settings_make_menu(`middle_click_close_button`, opts)
    App.settings_make_menu(`middle_click_open_button`, opts)
    App.settings_make_menu(`middle_click_pinline`, opts)

    DOM.ev(DOM.el(`#settings_extra_menu_add`), `click`, () => {
      App.addlist({id: `extra_menu`})
    })

    DOM.ev(DOM.el(`#settings_extra_menu`), `click`, (e) => {
      App.addlist_click({e: e, id: `extra_menu`})
    })

    DOM.ev(DOM.el(`#settings_empty_menu_add`), `click`, () => {
      App.addlist({id: `empty_menu`})
    })

    DOM.ev(DOM.el(`#settings_empty_menu`), `click`, (e) => {
      App.addlist_click({e: e, id: `empty_menu`})
    })

    DOM.ev(DOM.el(`#settings_footer_menu_add`), `click`, () => {
      App.addlist({id: `footer_menu`})
    })

    DOM.ev(DOM.el(`#settings_footer_menu`), `click`, (e) => {
      App.addlist_click({e: e, id: `footer_menu`})
    })
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
  let reset = DOM.create(`div`, `button`)
  reset.textContent = `Reset`
  container.append(reset)
  let close = DOM.create(`div`, `button`)
  close.textContent = App.close_text
  container.append(close)

  DOM.ev(reset, `click`, () => {
    App.reset_settings(category)
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
    App.apply_theme()
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
    App.apply_theme()
  })

  App.settings_make_menu(`background_tiles`, App.background_tiles, () => {
    App.apply_theme()
  })

  let auto_opts = [
    [`Never`, `never`],
    [`1 minute`, `1_minutes`],
    [`5 minutes`, `5_minutes`],
    [`30 minutes`, `30_minutes`],
    [`1 hour`, `1_hours`],
    [`6 hours`, `6_hours`],
    [`12 hours`, `12_hours`],
    [`24 hours`, `24_hours`],
  ]

  App.settings_make_menu(`auto_theme`, [...auto_opts, [`Domain`, `domain`], [`Party`, `party`]], () => {
    App.start_theme_interval(`auto_theme`)
  })

  App.settings_make_menu(`auto_background`, auto_opts, () => {
    App.start_theme_interval(`auto_background`)
  })

  App.settings_make_menu(`auto_background_mode`, [
    [`Only Pool`, `pool`],
    [`Only Random`, `random`],
    [`Pool & Random`, `pool_random`],
  ])

  App.settings_make_menu(`random_themes`, [
    [`Only Dark`, `dark`],
    [`Only Light`, `light`],
    [`Dark & Light`, `both`],
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

  DOM.ev(DOM.el(`#settings_background_pool_add`), `click`, () => {
    App.addlist({id: `pool`, items: [
      App.get_setting(`background_image`),
      App.get_setting(`background_effect`),
      App.get_setting(`background_tiles`),
    ], action: (value) => {
      App.apply_pool(value)
    }})
  })

  DOM.ev(DOM.el(`#settings_background_pool_next`), `click`, () => {
    App.background_from_pool()
  })

  DOM.ev(DOM.el(`#settings_background_pool_shuffle`), `click`, () => {
    App.shuffle_textarea(`background_pool`)
  })

  DOM.ev(DOM.el(`#settings_background_pool`), `click`, (e) => {
    App.addlist_click({e: e, id: `pool`, use: (c) => {
      App.change_background(c[0], c[1], c[2])
    }})
  })
}

App.settings_menu_cycle = (el, setting, dir, o_items) => {
  let cycle = true

  if (setting === `font_size` || setting === `width` || setting === `height`) {
    cycle = false
  }

  let waypoint = false
  let items = o_items.slice(0)

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
    App.show_settings_category(category)
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
  App.show_settings_category(`general`)
}

App.show_settings_category = (category) => {
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
  App.get_mode_order()
  App.make_mode_order()
  App.apply_theme()
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
    text: `Reset`,
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
      App.debug(`Stor: Adding setting: ${setting}`)
      App.settings[setting] = {}
      set_default(setting)
      changed = true
    }
  }

  for (let setting in App.settings) {
    // Remove unused settings
    if (App.default_settings[setting] === undefined) {
      App.debug(`Stor: Deleting setting: ${setting}`)
      delete App.settings[setting]
      changed = true
    }
    // Check new version
    else if (App.settings[setting].version !== App.default_settings[setting].version) {
      App.debug(`Stor: Upgrading setting: ${setting}`)
      set_default(setting)
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
    [`Do Nothing`, `none`],
    [App.separator_string],
  ]

  for (let cmd of App.commands) {
    if (cmd.name === App.separator_string) {
      items.push([App.separator_string])
    }
    else {
      items.push([cmd.name, cmd.cmd, cmd.icon])
    }
  }

  return items
}

App.tab_warn_opts = [
  [`Never`, `never`],
  [`Always`, `always`],
  [`Special`, `special`],
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

  items.push({separator: true})

  items.push({
    text: `Data`,
    get_items: () => {
      return App.settings_data_items()
    },
  })

  return items
}

App.is_default_setting = (setting) => {
  return App.settings[setting].value === App.default_setting_string ||
  App.settings[setting].value === App.get_default_setting(setting)
}

App.check_setting_default = (setting) => {
  if (setting === `mode_order`) {
    return App.is_default_setting(`tabs_index`) &&
    App.is_default_setting(`history_index`) &&
    App.is_default_setting(`bookmarks_index`) &&
    App.is_default_setting(`closed_index`)
  }
  else {
    return App.is_default_setting(setting)
  }
}

App.get_textarea_setting_value = (setting) => {
  return App.get_setting(setting).join(`\n`)
}

App.set_settings_menu = (setting, value) => {
  if (!value) {
    value = App.get_setting(setting)
  }

  let el = DOM.el(`#settings_${setting}`)
  let opts = App[`settings_${setting}_opts`]

  for (let o of opts) {
    if (o[1] === value) {
      el.textContent = o[0]
      break
    }
  }
}

App.apply_pool = (full) => {
  if (!full) {
    return
  }

  let items = App.addlist_items(full)
  App.change_background(items[0], items[1], items[2])
}

App.do_save_text_setting = (setting, el) => {
  let value = el.value.trim()

  if (el.classList.contains(`settings_textarea`)) {
    value = App.one_linebreak(value)
    value = value.split(`\n`).filter(x => x !== ``).map(x => x.trim())
    value = App.to_set(value)
    el.value = value.join(`\n`)
  }
  else {
    el.value = value
  }

  el.scrollTop = 0
  App.set_setting(setting, value)
  App.settings_do_action(el.dataset.action)
}

App.refresh_textarea = (setting) => {
  let value = App.get_textarea_setting_value(setting)
  DOM.el(`#settings_${setting}`).value = value
}

App.shuffle_textarea = (setting) => {
  App.show_confirm(`Shuffle items?`, () => {
    let items = App.get_setting(setting)
    App.shuffle_array(items)
    App.set_setting(setting, items)
    App.check_theme_refresh()
  })
}

App.default_backgrounds = () => {
  let names = [
    `waves.jpg`,
    `lights.jpg`,
    `merkoba.jpg`,
    `orbit.gif`,
    `lake.gif`,
  ]

  let items = []

  for (let name of names) {
    items.push(`${name} ; none ; none`)
  }

  return items
}

App.edit_setting = (setting) => {
  let value = App.get_textarea_setting_value(setting)

  App.show_input(`Edit: ${setting}`, `Done`, (text) => {
    let el = DOM.el(`#settings_${setting}`)
    el.value = text
    App.do_save_text_setting(setting, el)
  }, value)
}