App.unload_tabs = (item, multiple = true, mode = `all`) => {
  let items = []
  let active = false

  let used_items

  if (mode === `all`) {
    used_items = App.get_active_items({mode: `tabs`, item, multiple})
  }
  else if (mode === `normal`) {
    used_items = App.get_normal_tabs()
  }
  else if (mode === `pinned`) {
    used_items = App.get_pinned_tabs()
  }

  for (let it of used_items) {
    if (it.unloaded) {
      continue
    }

    if (App.is_new_tab(it.url)) {
      continue
    }
    else if (App.is_about_url(it.url)) {
      continue
    }
    else if (App.is_extension(it.url)) {
      continue
    }
    else if (App.is_zone(it)) {
      continue
    }

    if (mode === `normal`) {
      if (it.pinned) {
        continue
      }
    }
    else if (mode === `pinned`) {
      if (!it.pinned) {
        continue
      }
    }

    if (it.active) {
      active = true
    }

    items.push(it)
    console.log(it.url)
  }

  if (!items.length) {
    return
  }

  let force = App.check_warn(`warn_on_unload_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unload tabs? (${ids.length})`,
    confirm_action: async () => {
      if (active) {
        let succ = await App.get_tab_succ(items)

        if ((mode === `all`) && succ) {
          let method = `unload`
          await App.focus_tab({item: succ, scroll: `nearest_smooth`, method})
        }
        else {
          await App.blank_tab()
        }
      }

      App.do_unload_tabs(ids)
    },
    force,
  })
}

App.unload_normal_tabs = (item) => {
  App.unload_tabs(item, true, `normal`)
}

App.unload_pinned_tabs = (item) => {
  App.unload_tabs(item, true, `pinned`)
}

App.do_unload_tabs = async (ids) => {
  try {
    await browser.tabs.discard(ids)
  }
  catch (err) {
    App.error(err)
  }
}

App.unload_other_tabs = (item) => {
  let items = []

  function proc(include_pins) {
    if (!include_pins) {
      items = items.filter(x => !x.pinned)
    }

    let ids = items.map(x => x.id)

    App.show_confirm({
      message: `Unload other tabs? (${ids.length})`,
      confirm_action: () => {
        App.do_unload_tabs(ids)
      },
    })
  }

  let active = App.get_active_items({mode: `tabs`, item})

  if (!active.length) {
    return
  }

  for (let it of App.get_items(`tabs`)) {
    if (active.includes(it)) {
      continue
    }

    if (it.unloaded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  App.show_confirm({
    message: `Include pins?`,
    confirm_action: () => {
      proc(true)
    },
    cancel_action: () => {
      proc(false)
    },
  })
}

App.check_unloaded = (item) => {
  if (item.unloaded) {
    item.element.classList.add(`unloaded_tab`)
  }
  else {
    item.element.classList.remove(`unloaded_tab`)
  }
}

App.toggle_show_unloaded = () => {
  let og = App.get_setting(`show_unloaded_tabs`)
  App.set_setting({setting: `show_unloaded_tabs`, value: !og})

  if (!og) {
    App.show_all_unloaded()
  }

  App.do_filter({mode: App.active_mode})
  App.toggle_message(`Unloaded`, `show_unloaded_tabs`)
}

App.show_all_unloaded = () => {
  for (let item of App.get_items(`tabs`)) {
    if (item.unloaded) {
      App.show_item_2(item)
    }
  }
}