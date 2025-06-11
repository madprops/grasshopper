App.close_tabs = (args = {}) => {
  let def_args = {
    selection: [],
    multiple: true,
    title: `tabs`,
    force: false,
    full_force: false,
    no_smart: false,
    clear: true,
  }

  App.def_args(def_args, args)
  let items = []
  let active = false

  if (!args.selection.length) {
    args.selection = App.get_active_items({
      mode: `tabs`,
      item: args.item,
      multiple: args.multiple,
    })
  }

  for (let it of args.selection) {
    if (it.active) {
      active = true
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  if (args.full_force) {
    args.force = true
  }
  else if (!args.force) {
    args.force = App.check_warn(`warn_on_close_tabs`, items)
  }

  let smart_switch = App.get_setting(`smart_tab_switch`)

  if (args.no_smart) {
    smart_switch = false
  }

  App.show_confirm({
    message: `Close ${args.title}? (${items.length})`,
    confirm_action: async () => {
      App.close_tabs_date = App.now()

      if (smart_switch) {
        if (active) {
          let succ = App.get_tab_succ(items)

          if (succ) {
            for (let it of items) {
              await browser.tabs.update(it.id, {successorTabId: succ.id})
            }
          }
          else {
            await App.blank_tab()
          }
        }
      }

      let ids = items.map(x => x.id)
      await App.close_tab_or_tabs(ids)

      if (args.after) {
        args.after()
      }

      if (args.clear) {
        App.check_clear_on_close()
      }

      App.play_sound(`effect_1`)
    },
    force: args.force,
  })
}

App.close_active_tab = () => {
  let active = App.get_active_tab_item()

  if (active) {
    App.close_tab_or_tabs(active.id)
  }
}

App.start_close_tabs = () => {
  if (App.check_ready(`close_tabs`)) {
    return
  }

  App.create_popup({
    id: `close_tabs`,
    setup: () => {
      DOM.ev(`#close_tabs_include_pins`, `change`, () => {
        App.update_close_tabs_popup_button(App.close_tabs_type)
      })

      DOM.ev(`#close_tabs_include_normal`, `change`, () => {
        App.update_close_tabs_popup_button(App.close_tabs_type)
      })

      DOM.ev(`#close_tabs_include_unloaded`, `change`, () => {
        App.update_close_tabs_popup_button(App.close_tabs_type)
      })

      DOM.ev(`#close_tabs_button`, `click`, () => {
        App.close_tabs_action()
      })

      DOM.ev(`#close_tabs_prev`, `click`, () => {
        App.close_tabs_next(true)
      })

      DOM.ev(`#close_tabs_next`, `click`, () => {
        App.close_tabs_next()
      })

      DOM.ev(`#close_tabs_title`, `click`, (e) => {
        App.show_close_tabs_menu(e, undefined, false)
      })
    },
  })
}

App.close_tab_or_tabs = async (id_or_ids) => {
  try {
    await browser.tabs.remove(id_or_ids)
  }
  catch (err) {
    App.error(err)
  }
}

App.close_tabs_method = (items, force = false) => {
  let ids = items.map(x => x.id)

  if (!ids.length) {
    return
  }

  App.close_tabs({
    force,
    selection: items,
    no_smart: true,
    after: () => {
      App.hide_all_popups()
    },
  })
}

App.close_tabs_title = (type) => {
  if (type === `duplicate`) {
    type = `duplicates`
  }

  let s = `Close ${type.replace(/_/, ` `)}`
  return App.capitalize_words(s)
}

App.close_tabs_popup = (type, item) => {
  App.start_close_tabs()
  App.close_tabs_type = type
  App.close_tabs_item = item
  App.show_popup(`close_tabs`)
  let title = App.close_tabs_title(type)
  DOM.el(`#close_tabs_title`).textContent = title

  let pins_c = DOM.el(`#close_tabs_include_pins_container`)
  let normal_c = DOM.el(`#close_tabs_include_normal_container`)
  let unloaded_c = DOM.el(`#close_tabs_include_unloaded_container`)

  pins_c.classList.remove(`disabled`)
  normal_c.classList.remove(`disabled`)
  unloaded_c.classList.remove(`disabled`)

  let no_pins = [`normal`, `all`, `pinned`]
  let no_normal = [`normal`, `all`, `pinned`]
  let no_unloaded = [`unloaded`, `playing`, `loaded`, `empty`, `all`]
  let uncheck_normal = [`pinned`]
  let check_pins = [`pinned`, `all`]
  let check_unloaded = [`unloaded`, `all`]

  if (no_pins.includes(type)) {
    pins_c.classList.add(`disabled`)
  }

  if (check_pins.includes(type)) {
    DOM.el(`#close_tabs_include_pins`).checked = true
  }
  else {
    let force = App.get_setting(`tab_close_pins`)
    DOM.el(`#close_tabs_include_pins`).checked = force
  }

  if (no_normal.includes(type)) {
    normal_c.classList.add(`disabled`)
  }

  if (uncheck_normal.includes(type)) {
    DOM.el(`#close_tabs_include_normal`).checked = false
  }
  else {
    DOM.el(`#close_tabs_include_normal`).checked = true
  }

  if (no_unloaded.includes(type)) {
    unloaded_c.classList.add(`disabled`)
  }

  if (check_unloaded.includes(type)) {
    DOM.el(`#close_tabs_include_unloaded`).checked = true
  }
  else {
    let force = App.get_setting(`tab_close_unloaded`)
    DOM.el(`#close_tabs_include_unloaded`).checked = force
  }

  App.update_close_tabs_popup_button(type)
}

App.close_tabs_args = () => {
  let pins = DOM.el(`#close_tabs_include_pins`).checked
  let normal = DOM.el(`#close_tabs_include_normal`).checked
  let unloaded = DOM.el(`#close_tabs_include_unloaded`).checked
  return [pins, normal, unloaded]
}

App.update_close_tabs_popup_button = (type) => {
  let args = App.close_tabs_args()
  let items = App[`get_${type}_tabs_items`](...args)
  DOM.el(`#close_tabs_button`).textContent = `Close (${items.length})`
}

App.close_tabs_action = () => {
  let args = App.close_tabs_args()
  App[`close_${App.close_tabs_type}_tabs`](...args)
}

App.get_normal_tabs_items = (pins, normal, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (it.pinned) {
      continue
    }

    if (it.playing) {
      continue
    }

    if (!unloaded) {
      if (it.unloaded) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_normal_tabs = (pins, normal, unloaded) => {
  let items = App.get_normal_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_playing_tabs_items = (pins, normal, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.playing) {
      continue
    }

    if (!pins && it.pinned) {
      continue
    }

    if (!normal && !it.pinned) {
      continue
    }

    items.push(it)
  }

  return items
}

App.close_playing_tabs = (pins, normal, unloaded) => {
  let items = App.get_playing_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_loaded_tabs_items = (pins, normal, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (it.unloaded) {
      continue
    }

    if (!pins && it.pinned) {
      continue
    }

    if (!normal && !it.pinned) {
      continue
    }

    items.push(it)
  }

  return items
}

App.close_loaded_tabs = (pins, normal, unloaded) => {
  let items = App.get_loaded_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_unloaded_tabs_items = (pins, normal, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.unloaded) {
      continue
    }

    if (!pins && it.pinned) {
      continue
    }

    if (!normal && !it.pinned) {
      continue
    }

    items.push(it)
  }

  return items
}

App.close_unloaded_tabs = (pins, normal, unloaded) => {
  let items = App.get_unloaded_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_duplicate_tabs_items = (pins, normal, unloaded) => {
  let tabs = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(tabs, `url`)
  let items = App.get_excess(duplicates, `url`)
  items = items.filter(x => !x.playing)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!normal) {
    items = items.filter(x => x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.unloaded)
  }

  return items
}

App.close_duplicate_tabs = (pins, normal, unloaded) => {
  let items = App.get_duplicate_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_visible_tabs_items = (pins, normal, unloaded) => {
  let items = App.get_visible(`tabs`)
  items = items.filter(x => !x.playing)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!normal) {
    items = items.filter(x => x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.unloaded)
  }

  return items
}

App.close_visible_tabs = (pins, normal, unloaded) => {
  let items = App.get_visible_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_other_tabs_items = (pins, normal, unloaded) => {
  let items = []
  let active = App.get_active_items({mode: `tabs`, item: App.close_tabs_item})

  for (let item of App.get_items(`tabs`)) {
    if (active.includes(item)) {
      continue
    }

    items.push(item)
  }

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!normal) {
    items = items.filter(x => x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.unloaded)
  }

  return items
}

App.close_other_tabs = (pins, normal, unloaded) => {
  let items = App.get_other_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_all_tabs_items = (pins, normal, unloaded) => {
  return App.get_items(`tabs`)
}

App.close_all_tabs = (pins, normal, unloaded) => {
  let items = App.get_all_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_pinned_tabs_items = (pins, normal, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.pinned) {
      continue
    }

    if (!unloaded) {
      if (it.unloaded) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_pinned_tabs = (pins, normal, unloaded) => {
  let items = App.get_pinned_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.get_empty_tabs_items = (pins, normal, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!App.is_new_tab(it.url)) {
      continue
    }

    items.push(it)
  }

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!normal) {
    items = items.filter(x => x.pinned)
  }

  return items
}

App.close_empty_tabs = (pins, normal, unloaded) => {
  let items = App.get_empty_tabs_items(pins, normal, unloaded)

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.show_close_tabs_menu = (e, item, all = true) => {
  let items = []

  for (let type of App.close_tabs_types) {
    if (type === `all`) {
      App.sep(items)

      if (all) {
        items.push(App.cmd_item({
          cmd: `close_color_all`,
          from: `close_tabs`,
          item,
        }))

        items.push(App.cmd_item({
          cmd: `close_tag_all`,
          from: `close_tabs`,
          item,
        }))

        App.sep(items)
      }
    }

    items.push(App.cmd_item({
      cmd: `close_${type}_tabs`,
      from: `close_tabs`,
      item,
    }))
  }

  App.show_context({items, e})
}

App.close_tabs_next = (reverse = false) => {
  let types = App.close_tabs_types.slice(0)

  if (reverse) {
    types.reverse()
  }

  let waypoint = false

  for (let type of types) {
    if (waypoint) {
      App.close_tabs_popup(type)
      return
    }

    if (App.close_tabs_type === type) {
      waypoint = true
    }
  }

  App.close_tabs_popup(types[0])
}

App.close_first_tab = () => {
  let first = App.get_items(`tabs`)[0]
  App.close_tabs({item: first})
}

App.close_last_tab = () => {
  let last = App.get_items(`tabs`).at(-1)
  App.close_tabs({item: last})
}

App.check_clear_on_close = () => {
  let mode = `tabs`

  if (App.get_setting(`clear_on_close`)) {
    if (App.is_filtered(mode)) {
      if (!App.get_visible(mode).length) {
        App.filter_all(mode)
      }
    }
  }
}