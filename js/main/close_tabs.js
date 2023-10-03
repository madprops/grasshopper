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
  let force = App.check_tab_force(`warn_on_close_tabs`, items)
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
}

App.close_tabs_toggle = () => {
  let type = App.close_tabs_type
  let checkbox

  if (type === `normal`) {
    checkbox = DOM.el(`#close_tabs_include_unloaded`)
  }
  else {
    checkbox = DOM.el(`#close_tabs_include_pins`)
  }

  checkbox.checked = !checkbox.checked
}

App.close_tabs_action = () => {
  let type = App.close_tabs_type
  let arg

  if (type === `normal`) {
    arg = DOM.el(`#close_tabs_include_unloaded`).checked
  }
  else {
    arg = DOM.el(`#close_tabs_include_pins`).checked
  }

  App[`close_${type}_tabs`](arg)
}

App.close_normal_tabs = (close_unloaded = false) => {
  let ids = []

  for (let it of App.get_items(`tabs`)) {
    if (!close_unloaded) {
      if (it.discarded) {
        continue
      }
    }

    if (!it.pinned && !it.audible) {
      ids.push(it.id)
    }
  }

  if (!ids.length) {
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_normal_tabs`, ids.length)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.close_playing_tabs = (close_pins = false) => {
  let ids = []

  for (let it of App.get_items(`tabs`)) {
    if (!close_pins) {
      if (it.pinned) {
        continue
      }
    }

    if (it.audible) {
      ids.push(it.id)
    }
  }

  if (!ids.length) {
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_playing_tabs`, ids.length)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.close_unloaded_tabs = (close_pins = false) => {
  let ids = []

  for (let it of App.get_items(`tabs`)) {
    if (!close_pins) {
      if (it.pinned) {
        continue
      }
    }

    if (it.discarded) {
      ids.push(it.id)
    }
  }

  if (!ids.length) {
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_unloaded_tabs`, ids.length)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.close_duplicate_tabs = (close_pins = false) => {
  let items = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(items, `url`)
  let excess = App.get_excess(duplicates, `url`)

  if (close_pins) {
    excess = excess.filter(x => !x.playing)
  }
  else {
    excess = excess.filter(x => !x.pinned && !x.playing)
  }

  let ids = excess.map(x => x.id)

  if (!ids.length) {
    App.alert(`No duplicates found`)
    return
  }

  let force = App.check_force(`warn_on_close_duplicate_tabs`, ids.length)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.close_visible_tabs = (close_pins = false) => {
  let visible = App.get_visible(`tabs`)

  if (!close_pins) {
    visible = visible.filter(x => !x.pinned)
  }

  let ids = visible.map(x => x.id)

  if (!ids.length) {
    App.alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_visible_tabs`, ids.length)

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