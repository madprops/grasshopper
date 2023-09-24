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

App.close_normal_tabs = () => {
  App.show_popup(`close_normal`)
  DOM.el(`#close_normal_unloaded`).checked = false
}

App.close_normal_tabs_action = () => {
  let close_unloaded = DOM.el(`#close_normal_unloaded`).checked
  App.do_close_normal_tabs(close_unloaded)
}

App.do_close_normal_tabs = (close_unloaded = true) => {
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
    App.show_alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_normal_tabs`, ids.length)

  App.show_confirm(App.close_tabs_message(ids.length), () => {
    App.close_tab_or_tabs(ids)
    App.hide_all_popups()
  }, undefined, force)
}

App.close_tabs_popup = (type) => {
  App.close_tabs_type = type
  App.show_popup(`close_tabs`)
  let title = App.capitalize_words(`Close ${type} tabs`)
  DOM.el(`#close_tabs_title`).textContent = title
  DOM.el(`#close_tabs_include_pins`).checked = false
}

App.close_tabs_action = () => {
  let type = App.close_tabs_type
  let close_pins = DOM.el(`#close_tabs_include_pins`).checked
  App[`close_${type}_tabs`](close_pins)
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
    App.show_alert(`Nothing to close`)
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
    App.show_alert(`Nothing to close`)
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
    App.show_alert(`No duplicates found`)
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
    App.show_alert(`Nothing to close`)
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

App.close_tabs_menu = () => {
  let items = []

  items.push({
    text: `Close Normal Tabs`,
    action: () => {
      App.close_normal_tabs()
    }
  })

  items.push({
    text: `Close Playing Tabs`,
    action: () => {
      App.close_tabs_popup(`playing`)
    }
  })

  items.push({
    text: `Close Unloaded Tabs`,
    action: () => {
      App.close_tabs_popup(`unloaded`)
    }
  })

  items.push({
    text: `Close Duplicate Tabs`,
    action: () => {
      App.close_tabs_popup(`duplicate`)
    }
  })

  items.push({
    text: `Close Visible Tabs`,
    action: () => {
      App.close_tabs_popup(`visible`)
    }
  })

  NeedContext.show_on_center(items)
}