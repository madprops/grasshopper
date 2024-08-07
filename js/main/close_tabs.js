App.start_close_tabs = () => {
  if (App.check_ready(`close_tabs`)) {
    return
  }

  App.create_popup({
    id: `close_tabs`,
    setup: () => {
      DOM.ev(DOM.el(`#close_tabs_include_pins`), `change`, () => {
        App.update_close_tabs_popup_button(App.close_tabs_type)
      })

      DOM.ev(DOM.el(`#close_tabs_include_unloaded`), `change`, () => {
        App.update_close_tabs_popup_button(App.close_tabs_type)
      })

      DOM.ev(DOM.el(`#close_tabs_button`), `click`, () => {
        App.close_tabs_action()
      })

      DOM.ev(DOM.el(`#close_tabs_prev`), `click`, () => {
        App.close_tabs_next(true)
      })

      DOM.ev(DOM.el(`#close_tabs_next`), `click`, () => {
        App.close_tabs_next()
      })

      DOM.ev(DOM.el(`#close_tabs_title`), `click`, (e) => {
        App.show_close_tabs_menu(e)
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

  App.show_confirm({
    message: `Close tabs? (${ids.length})`,
    confirm_action: () => {
      App.close_tab_or_tabs(ids)
      App.hide_all_popups()
    },
    force: force,
  })
}

App.close_tabs = (item, multiple = true) => {
  let items = App.get_active_items({mode: `tabs`, item: item, multiple: multiple})

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  let force = App.check_force(`warn_on_close_tabs`, items)
  App.close_tabs_method(items, force)
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
  DOM.el(`#close_tabs_include_pins`).checked = false
  DOM.el(`#close_tabs_include_unloaded`).checked = false
  let pins_c = DOM.el(`#close_tabs_include_pins_container`)
  let unloaded_c = DOM.el(`#close_tabs_include_unloaded_container`)
  pins_c.classList.remove(`disabled`)
  unloaded_c.classList.remove(`disabled`)
  let no_pins = [`normal`, `all`, `pinned`]
  let no_unloaded = [`unloaded`, `playing`, `loaded`, `empty`, `all`]

  if (no_pins.includes(type)) {
    pins_c.classList.add(`disabled`)
  }

  if (no_unloaded.includes(type)) {
    unloaded_c.classList.add(`disabled`)
  }

  App.update_close_tabs_popup_button(type)
}

App.close_tabs_args = () => {
  let pins = DOM.el(`#close_tabs_include_pins`).checked
  let unloaded = DOM.el(`#close_tabs_include_unloaded`).checked
  return [pins, unloaded]
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

App.get_normal_tabs_items = (pins, unloaded) => {
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

App.close_normal_tabs = (pins, unloaded) => {
  let items = App.get_normal_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_playing_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.playing) {
      continue
    }

    if (!pins) {
      if (it.pinned) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_playing_tabs = (pins, unloaded) => {
  let items = App.get_playing_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_loaded_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (it.unloaded) {
      continue
    }

    if (!pins) {
      if (it.pinned) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_loaded_tabs = (pins, unloaded) => {
  let items = App.get_loaded_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_unloaded_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.unloaded) {
      continue
    }

    if (!pins) {
      if (it.pinned) {
        continue
      }
    }

    items.push(it)
  }

  return items
}

App.close_unloaded_tabs = (pins, unloaded) => {
  let items = App.get_unloaded_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_duplicate_tabs_items = (pins, unloaded) => {
  let tabs = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(tabs, `url`)
  let items = App.get_excess(duplicates, `url`)
  items = items.filter(x => !x.playing)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.unloaded)
  }

  return items
}

App.close_duplicate_tabs = (pins, unloaded) => {
  let items = App.get_duplicate_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_visible_tabs_items = (pins, unloaded) => {
  let items = App.get_visible(`tabs`)
  items = items.filter(x => !x.playing)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.unloaded)
  }

  return items
}

App.close_visible_tabs = (pins, unloaded) => {
  let items = App.get_visible_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_other_tabs_items = (pins, unloaded) => {
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

  if (!unloaded) {
    items = items.filter(x => !x.unloaded)
  }

  return items
}

App.close_other_tabs = (pins, unloaded) => {
  let items = App.get_other_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_all_tabs_items = (pins, unloaded) => {
  return App.get_items(`tabs`)
}

App.close_all_tabs = (pins, unloaded) => {
  let items = App.get_all_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_pinned_tabs_items = (pins, unloaded) => {
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

App.close_pinned_tabs = (pins, unloaded) => {
  let items = App.get_pinned_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.get_empty_tabs_items = (pins, unloaded) => {
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

  return items
}

App.close_empty_tabs = (pins, unloaded) => {
  let items = App.get_empty_tabs_items(pins, unloaded)

  if (!items.length) {
    App.nothing_to_close()
    return
  }

  App.close_tabs_method(items)
}

App.show_close_tabs_menu = (e, item) => {
  let items = []

  for (let type of App.close_tabs_types) {
    items.push(App.cmd_item({
      cmd: `close_${type}_tabs`,
      from: `close_tabs`,
      item: item,
    }))
  }

  App.sep(items)

  items.push(App.cmd_item({
    cmd: `close_color_all`,
    from: `close_tabs`,
    item: item,
  }))

  items.push(App.cmd_item({
    cmd: `close_tag_all`,
    from: `close_tabs`,
    item: item,
  }))

  App.show_context({items: items, e: e})
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

App.nothing_to_close = () => {
  App.alert(`Nothing to close`)
}

App.close_first_tab = () => {
  let first = App.get_items(`tabs`)[0]
  App.close_tabs(first)
}

App.close_last_tab = () => {
  let last = App.get_items(`tabs`).slice(-1)[0]
  App.close_tabs(last)
}