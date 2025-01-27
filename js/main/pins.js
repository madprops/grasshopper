App.pin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: true})
  }
  catch (err) {
    App.error(err)
  }
}

App.unpin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.pin_tabs = (item, force = false) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item})) {
    if (it.pinned) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  if (!force) {
    force = App.check_warn(`warn_on_pin_tabs`, items)
  }

  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Pin items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.pin_tab(id)
      }
    },
    force,
  })
}

App.unpin_tabs = (item, force = false) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item})) {
    if (!it.pinned) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  if (!force) {
    force = App.check_warn(`warn_on_unpin_tabs`, items)
  }

  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unpin items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.unpin_tab(id)
      }
    },
    force,
  })
}

App.toggle_pin = (item) => {
  if (item.pinned) {
    App.unpin_tab(item.id)
  }
  else {
    App.pin_tab(item.id)
  }
}

App.toggle_pin_tabs = (item) => {
  let items = []
  let action

  for (let it of App.get_active_items({mode: `tabs`, item})) {
    if (!action) {
      if (it.pinned) {
        action = `unpin`
      }
      else {
        action = `pin`
      }
    }

    if (action === `pin`) {
      if (it.pinned) {
        continue
      }
    }
    else if (action === `unpin`) {
      if (!it.pinned) {
        continue
      }
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_warn(`warn_on_pin_tabs`, items)
  let ids = items.map(x => x.id)
  let msg = ``

  if (action === `pin`) {
    msg = `Pin items?`
  }
  else {
    msg = `Unpin items?`
  }

  msg += ` (${ids.length})`

  App.show_confirm({
    message: msg,
    confirm_action: async () => {
      for (let id of ids) {
        if (action === `pin`) {
          App.pin_tab(id)
        }
        else {
          App.unpin_tab(id)
        }
      }
    },
    force,
  })
}

App.get_last_pin_index = () => {
  let i = -1

  for (let item of App.get_items(`tabs`)) {
    if (item.pinned) {
      i += 1
    }
    else {
      return i
    }
  }

  return i
}

App.new_pin_tab = () => {
  App.open_new_tab({pinned: true})
}

App.toggle_show_pins = () => {
  let og = App.get_setting(`show_pinned_tabs`)
  App.set_setting({setting: `show_pinned_tabs`, value: !og})

  if (!og) {
    App.show_all_pins()
  }

  App.do_filter({mode: App.active_mode})
  App.toggle_message(`Pins`, `show_pinned_tabs`)
}

App.get_first_pinned_tab = () => {
  let items = App.get_items(`tabs`)
  return items.find(x => x.pinned)
}

App.first_pinned_tab = () => {
  let first = App.get_first_pinned_tab()

  if (first) {
    App.tabs_action({item: first})
  }
}

App.get_last_pinned_tab = () => {
  let items = App.get_items(`tabs`)
  return items.slice(0).reverse().find(x => x.pinned)
}

App.last_pinned_tab = () => {
  let last = App.get_last_pinned_tab()

  if (last) {
    App.tabs_action({item: last})
  }
}

App.show_all_pins = () => {
  for (let item of App.get_items(`tabs`)) {
    if (item.pinned) {
      App.show_item_2(item)
    }
  }
}

App.pin_all_tabs = () => {
  App.change_all_tabs({
    items: App.get_normal_tabs(),
    warn: `warn_on_pin_tabs`,
    message: `Pin items`,
    action: App.pin_tab,
  })
}

App.unpin_all_tabs = () => {
  App.change_all_tabs({
    items: App.get_pinned_tabs(),
    warn: `warn_on_unpin_tabs`,
    message: `Unpin items`,
    action: App.unpin_tab,
  })
}