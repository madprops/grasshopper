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

  let plural = App.close_tabs_message(ids.length)
  let s = App.plural(ids.length, `Close this tab?`, plural)

  App.show_confirm(s, () => {
    App.close_tab_or_tabs(ids)
  }, undefined, force)
}

App.close_tabs_popup = (type) => {
  App.start_tab_popups()
  App.close_tabs_type = type
  App.show_popup(`close_tabs`)
  let title = App.capitalize_words(`Close ${type}`)
  DOM.el(`#close_tabs_title`).textContent = title

  if (type === `normal`) {
    DOM.el(`#close_tabs_include_pins_container`).classList.add(`hidden`)
    DOM.el(`#close_tabs_include_unloaded_container`).classList.remove(`hidden`)
  }
  else {
    DOM.el(`#close_tabs_include_pins_container`).classList.remove(`hidden`)
    DOM.el(`#close_tabs_include_unloaded_container`).classList.add(`hidden`)
  }

  DOM.el(`#close_tabs_include_pins`).checked = false
  DOM.el(`#close_tabs_include_unloaded`).checked = false
  App.update_close_tabs_popup_button(type)
}

App.update_close_tabs_popup_button = (type) => {
  let checked = App.get_close_tabs_popup_toggle(type).checked
  let items = App[`get_${type}_tabs_items`](checked)
  DOM.el(`#close_tabs_button`).textContent = `Close (${items.length})`
}

App.get_close_tabs_popup_toggle = (type) => {
  if (type === `normal`) {
    return DOM.el(`#close_tabs_include_unloaded`)
  }
  else {
    return DOM.el(`#close_tabs_include_pins`)
  }
}

App.close_tabs_toggle = () => {
  let type = App.close_tabs_type
  let checkbox = App.get_close_tabs_popup_toggle(type)
  checkbox.checked = !checkbox.checked
}

App.close_tabs_action = () => {
  let type = App.close_tabs_type
  let arg = App.get_close_tabs_popup_toggle(type).checked
  App[`close_${type}_tabs`](arg)
}

App.get_normal_tabs_items = (close_unloaded = false) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!close_unloaded) {
      if (it.discarded) {
        continue
      }
    }

    if (!it.pinned && !it.audible) {
      items.push(it)
    }
  }

  return items
}

App.close_normal_tabs = (close_unloaded = false) => {
  let items = App.get_normal_tabs_items(close_unloaded)

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

App.get_playing_tabs_items = (close_pins = false) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!close_pins) {
      if (it.pinned) {
        continue
      }
    }

    if (it.audible) {
      items.push(it)
    }
  }

  return items
}

App.close_playing_tabs = (close_pins = false) => {
  let items = App.get_playing_tabs_items(close_pins)

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

App.get_unloaded_tabs_items = (close_pins = false) => {
  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (!close_pins) {
      if (it.pinned) {
        continue
      }
    }

    if (it.discarded) {
      items.push(it)
    }
  }

  return items
}

App.close_unloaded_tabs = (close_pins = false) => {
  let items = App.get_unloaded_tabs_items(close_pins)

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

App.get_duplicate_tabs_items = (close_pins = false) => {
  let tabs = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(tabs, `url`)
  let items = App.get_excess(duplicates, `url`)

  if (close_pins) {
    items = items.filter(x => !x.playing)
  }
  else {
    items = items.filter(x => !x.pinned && !x.playing)
  }

  return items
}

App.close_duplicate_tabs = (close_pins = false) => {
  let items = App.get_duplicate_tabs_items(close_pins)

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

App.get_visible_tabs_items = (close_pins = false) => {
  let items = App.get_visible(`tabs`)

  if (!close_pins) {
    items = items.filter(x => !x.pinned)
  }

  return items
}

App.close_visible_tabs = (close_pins = false) => {
  let items = App.get_visible_tabs_items(close_pins)

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

App.close_tabs_menu = (e) => {
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