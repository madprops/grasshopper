App.mute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: true})
  }
  catch (err) {
    App.error(err)
  }
}

App.unmute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.mute_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item})) {
    if (!it.muted) {
      items.push(it)
    }
  }

  if (!items.length) {
    return
  }

  let force = App.check_warn(`warn_on_mute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Mute items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.mute_tab(id)
      }
    },
    force,
  })
}

App.unmute_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item})) {
    if (it.muted) {
      items.push(it)
    }
  }

  if (!items.length) {
    return
  }

  let force = App.check_warn(`warn_on_unmute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unmute items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.unmute_tab(id)
      }
    },
    force,
  })
}

App.toggle_mute_tabs = (item) => {
  let ids = []
  let action

  for (let it of App.get_active_items({mode: `tabs`, item})) {
    if (!action) {
      if (it.muted) {
        action = `unmute`
      }
      else {
        action = `mute`
      }
    }

    if (action === `mute`) {
      if (it.muted) {
        continue
      }
    }
    else if (action === `unmute`) {
      if (!it.muted) {
        continue
      }
    }

    ids.push(it.id)
  }

  if (!ids.length) {
    return
  }

  for (let id of ids) {
    if (action === `mute`) {
      App.mute_tab(id)
    }
    else {
      App.unmute_tab(id)
    }
  }
}

App.mute_playing_tabs = () => {
  let items = App.get_playing_tabs()

  if (!items.length) {
    return
  }

  let force = App.check_warn(`warn_on_mute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Mute items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.mute_tab(id)
      }
    },
    force,
  })
}

App.unmute_all_tabs = () => {
  let items = App.get_muted_tabs()

  if (!items.length) {
    return
  }

  let force = App.check_warn(`warn_on_unmute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unmute items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.unmute_tab(id)
      }
    },
    force,
  })
}