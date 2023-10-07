App.start_close_tabs = () => {
  if (App.check_ready(`close_tabs`)) {
    return
  }

  App.create_popup({
    id: `close_tabs`,
    setup: () => {
      App.close_tabs_types = [`normal`, `playing`, `unloaded`, `duplicate`, `visible`]

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

App.close_tabs = (item, multiple = true) => {
  let items = App.get_active_items(`tabs`, item, multiple)
  let force = App.check_force(`warn_on_close_tabs`, items)
  let ids = items.map(x => x.id)

  if (!ids.length) {
    return
  }

  App.show_confirm(`Close tabs? (${ids.length})`, () => {
    App.close_tab_or_tabs(ids)
  }, undefined, force)
}

App.close_tabs_popup = (type) => {
  App.start_close_tabs()
  App.close_tabs_type = type
  App.show_popup(`close_tabs`)
  let title = App.capitalize_words(`Close ${type}`)
  DOM.el(`#close_tabs_title`).textContent = title
  DOM.el(`#close_tabs_include_pins`).checked = false
  DOM.el(`#close_tabs_include_unloaded`).checked = false
  let pins_c = DOM.el(`#close_tabs_include_pins_container`)
  let unloaded_c = DOM.el(`#close_tabs_include_unloaded_container`)
  pins_c.classList.remove(`disabled`)
  unloaded_c.classList.remove(`disabled`)

  if (type === `normal`) {
    pins_c.classList.add(`disabled`)
  }
  else if (type === `unloaded` || type === `playing`) {
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

    if (it.audible) {
      continue
    }

    if (!unloaded) {
      if (it.discarded) {
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
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_normal_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.get_playing_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.audible) {
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
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_playing_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.get_unloaded_tabs_items = (pins, unloaded) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.discarded) {
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
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_unloaded_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.get_duplicate_tabs_items = (pins, unloaded) => {
  let tabs = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(tabs, `url`)
  let items = App.get_excess(duplicates, `url`)
  items = items.filter(x => !x.audible)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.discarded)
  }

  return items
}

App.close_duplicate_tabs = (pins, unloaded) => {
  let items = App.get_duplicate_tabs_items(pins, unloaded)

  if (!items.length) {
    App.alert(`No duplicates found`)
    return
  }

  let force = App.check_force(`warn_on_close_duplicate_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.get_visible_tabs_items = (pins, unloaded) => {
  let items = App.get_visible(`tabs`)
  items = items.filter(x => !x.audible)

  if (!pins) {
    items = items.filter(x => !x.pinned)
  }

  if (!unloaded) {
    items = items.filter(x => !x.discarded)
  }

  return items
}

App.close_visible_tabs = (pins, unloaded) => {
  let items = App.get_visible_tabs_items(pins, unloaded)

  if (!items.length) {
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_visible_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.close_tabs_message = (count) => {
  return `Close these tabs? (${count})`
}

App.close_other_new_tabs = (id) => {
  let items = App.get_items(`tabs`)
  let ids = []

  for (let item of items) {
    if (App.is_new_tab(item.url)) {
      if (item.id !== id) {
        ids.push(item.id)
      }
    }
  }

  if (ids.length) {
    App.close_tab_or_tabs(ids)
  }
}

App.show_close_tabs_menu = (e) => {
  let items = []

  items.push({
    text: `Close Normal`,
    action: () => {
      App.close_tabs_popup(`normal`)
    }
  })

  items.push({
    text: `Close Playing`,
    action: () => {
      App.close_tabs_popup(`playing`)
    }
  })

  items.push({
    text: `Close Unloaded`,
    action: () => {
      App.close_tabs_popup(`unloaded`)
    }
  })

  items.push({
    text: `Close Duplicate`,
    action: () => {
      App.close_tabs_popup(`duplicate`)
    }
  })

  items.push({
    text: `Close Visible`,
    action: () => {
      App.close_tabs_popup(`visible`)
    }
  })

  App.show_center_context(items, e)
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