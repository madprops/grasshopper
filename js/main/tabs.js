// Setup tabs
App.setup_tabs = function () {
  App.tabs_filter_modes = [
    ["pins", "Pins"],
    ["playing", "Playing"],
    ["muted", "Muted"],
    ["active", "Active"],
    ["normal", "Normal"],
    ["http", "Http"],
    ["https", "Https"],
    ["suspended", "zzz"],
  ]

  App.tabs_actions = [
    {text: "--separator--"},

    {text: "New", action: function () {
      App.new_tab()
    }},

    {text: "Info", action: function () {
      App.show_tabs_information()
    }},

    {text: "State", items: [
      {
        text: "Save State", items: App.get_save_tab_state_items()
      },
      {
        text: "Load State", items: App.get_load_tab_state_items()
      }
    ]},

    {text: "Undo", action: function () {
      App.undo_close()
    }},

    {text: "Clean", action: function () {
      App.clean_tabs()
    }},
  ]

  App.setup_item_window("tabs")

  function checks () {
    App.check_playing()
    App.show_pinline()
  }

  browser.tabs.onUpdated.addListener(async function (id, cinfo, info) {
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      await App.refresh_tab(id)
      checks()
    }
  })

  browser.tabs.onActivated.addListener(async function (info) {
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      await App.on_tab_activated(info)
      checks()
    }
  })

  browser.tabs.onRemoved.addListener(function (id, info) {
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      App.remove_closed_tab(id)
      checks()
    }
  })

  browser.tabs.onMoved.addListener(function (id, info) {
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      App.move_item("tabs", info.fromIndex, info.toIndex)
      checks()
    }
  })

  browser.tabs.onDetached.addListener(function (id, info) {
    if (App.window_mode === "tabs" && info.oldWindowId === App.window_id) {
      App.remove_closed_tab(id)
      checks()
    }
  })

  App.unlock_backup_tabs = App.create_debouncer(function () {
    App.backup_tabs_locked = false
  }, App.lock_backup_delay)

  App.empty_previous_tabs = App.create_debouncer(function () {
    App.do_empty_previous_tabs()
  }, App.empty_previous_tabs_delay)

  App.ev(App.el("#window_tabs"), "dblclick", function (e) {
    if (e.target.id === "tabs_container") {
      App.new_tab()
    }
  })
}

// Get open tabs
App.get_tabs = async function () {
  let tabs = await browser.tabs.query({currentWindow: true})

  tabs.sort(function (a, b) {
    return a.index < b.index ? -1 : 1
  })

  return tabs
}

// Open a new tab
App.focus_tab = async function (tab, close = true) {
  if (tab.window_id) {
    await browser.windows.update(tab.window_id, {focused: true})
  }

  await browser.tabs.update(tab.id, {active: true})

  if (close && App.settings.switch_to_tabs) {
    App.close_window()
  }
}

// Close a tab
App.close_tab = function (id) {
  browser.tabs.remove(id)
}

// Open a new tab
App.new_tab = async function (url = undefined, close = true) {
  await browser.tabs.create({active: close, url: url})

  if (close) {
    App.close_window()
  }
}

// Refresh tabs
App.refresh_tab = async function (id, select = false) {
  let info = await browser.tabs.get(id)
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    App.update_item("tabs", tab.id, info)
  }
  else {
    tab = App.insert_item("tabs", info)
  }

  if (select) {
    App.select_item(tab)
  }
}

// Pin a tab
App.pin_tab = async function (id) {
  await browser.tabs.update(id, {pinned: true})
}

// Unpin a tab
App.unpin_tab = async function (id) {
  await browser.tabs.update(id, {pinned: false})
}

// Mute a tab
App.mute_tab = async function (id) {
  await browser.tabs.update(id, {muted: true})
}

// Unmute a tab
App.unmute_tab = async function (id) {
  await browser.tabs.update(id, {muted: false})
}

// Return pinned tabs
App.get_pinned_tabs = function () {
  return App.tabs_items.filter(x => x.pinned)
}

// Return playing tabs
App.get_playing_tabs = function () {
  return App.tabs_items.filter(x => x.audible)
}

// Return muted tabs
App.get_muted_tabs = function () {
  return App.tabs_items.filter(x => x.muted)
}

// Return suspended tabs
App.get_suspended_tabs = function () {
  return App.tabs_items.filter(x => x.discarded)
}

// Remove a closed tab
App.remove_closed_tab = function (id) {
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    App.remove_item(tab)
  }
}

// Tabs action
App.tabs_action = function (item) {
  App.focus_tab(item)
}

// Tabs action alt
App.tabs_action_alt = function (item, shift_key = false) {
  App.close_tabs(item, shift_key)
}

// Duplicate a tab
App.duplicate_tab = function (tab) {
  browser.tabs.create({active: true, url: tab.url})
  App.close_window()
}

// Suspend a tab
App.suspend_tab = async function (tab) {
  if (tab.active) {
    await browser.tabs.create({active: true})
  }

  await browser.tabs.discard(tab.id)
}

// Pin tabs
App.pin_tabs = function (item) {
  let ids = []
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (tab.pinned) {
      continue
    }

    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }

  for (let id of ids) {
    App.pin_tab(id)
  }

  App.dehighlight("tabs")
}

// Unpin tabs
App.unpin_tabs = function (item) {
  let ids = []
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (!tab.pinned) {
      continue
    }

    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }

  for (let id of ids) {
    App.unpin_tab(id)
  }

  App.dehighlight("tabs")
}

// Suspend normal tabs
App.suspend_tabs = function (item) {
  let tabs = []
  let warn = false
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (!App.is_http(tab)) {
      continue
    }

    if (tab.pinned || tab.audible) {
      warn = true
    }

    tabs.push(tab)
  }

  if (tabs.length === 0) {
    return
  }

  if (warn) {
    App.show_confirm(`Suspend tabs? (${tabs.length})`, function () {
      for (let tab of tabs) {
        App.suspend_tab(tab)
      }

      App.dehighlight("tabs")
    }, function () {
      App.dehighlight("tabs")
    })
  }
  else {
    for (let tab of tabs) {
      App.suspend_tab(tab)
    }

    App.dehighlight("tabs")
  }
}

// Close tabs
App.close_tabs = function (item, force = false) {
  let ids = []
  let warn = false
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (tab.pinned || tab.audible) {
      warn = true
    }

    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }

  App.show_confirm(`Close tabs? (${ids.length})`, function () {
    App.do_close_tabs(ids)
    App.dehighlight("tabs")
  }, function () {
    App.dehighlight("tabs")
  }, force || !warn)
}

// Do close tabs
App.do_close_tabs = function (ids) {
  App.backup_tabs()

  for (let id of ids) {
    App.close_tab(id)
  }
}

// Mute tabs
App.mute_tabs = function (item) {
  let active = App.get_active_items("tabs", item)

  for (let item of active) {
    App.mute_tab(item.id)
  }

  App.dehighlight("tabs")
}

// Unmute tabs
App.unmute_tabs = function (item) {
  let active = App.get_active_items("tabs", item)

  for (let item of active) {
    App.unmute_tab(item.id)
  }

  App.dehighlight("tabs")
}

// Check if tab is normal
App.tab_is_normal = function (tab) {
  let special = tab.pinned || tab.audible || tab.muted || tab.discarded
  return !special
}

// Show tabs information
App.show_tabs_information = function () {
  let all = App.tabs_items.length
  let pins = App.get_pinned_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let suspended = App.get_suspended_tabs().length

  let s = "Tab Count:\n\n"

  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
  s += `Playing: ${playing}\n`
  s += `Muted: ${muted}\n`
  s += `Suspended: ${suspended}`

  App.show_alert(s)
}

// Pin or unpin
App.toggle_pin = function (item) {
  if (item.pinned) {
    App.unpin_tab(item.id)
  }
  else {
    App.pin_tab(item.id)
  }
}

// Save tab state
App.save_tab_state = function (n) {
  App.show_confirm(`Save tab state on #${n}?`, function () {
    App.tab_state[n] = App.get_tab_state()
    App.stor_save_tab_state()
  })
}

// Load tab state
App.load_tab_state = function (n) {
  let items = App.tab_state[n]

  if (!items) {
    App.show_feedback(`Nothing saved on #${n}`)
    return
  }

  App.do_load_tab_state(items)
}

// Do load tab state
App.do_load_tab_state = function (items, confirm = true) {
  let urls = items.map(x => x.url)
  let to_open = items.slice(0)
  let to_close = []
  let tabs = App.tabs_items

  for (let tab of tabs) {
    for (let [i, item] of to_open.entries()) {
      if ((tab.url === item.url) || (item.url === "about" && !App.is_http(tab))) {
        to_open.splice(i, 1)
        break
      }
    }
  }

  for (let tab of tabs) {
    let url = App.is_http(tab) ? tab.url : "about"
    let i = urls.indexOf(url)

    if (i === -1) {
      to_close.push(tab)
    }
    else {
      urls.splice(i, 1)
    }
  }

  let s1 = App.plural(to_open.length, "tab", "tabs")
  let s2 = App.plural(to_close.length, "tab", "tabs")

  async function restore () {
    App.show_alert("Restoring...")

    for (let item of to_close) {
      App.close_tab(item.id)
    }

    for (let item of to_open) {
      try {
        if (item.url === "about") {
          await App.new_tab(undefined, false)
        }
        else {
          await App.open_tab(item.url, false)
        }
      }
      catch (e) {
        console.error(e)
      }
    }

    setTimeout(async function () {
      setTimeout(function () {
        App.hide_popup("alert")
        App.show_item_window("tabs")
      }, App.load_tabs_delay)

      let tabs = App.tabs_items.slice(0)

      for (let tab of tabs) {
        tab.xset = false
        tab.xindex = tabs.length
      }

      for (let [i, item] of items.entries()) {
        for (let tab of tabs) {
          if ((!item.empty && (item.url === tab.url)) || (item.url === "about" && !App.is_http(tab))) {
            if (!tab.xset) {
              tab.pinned = item.pinned
              tab.discarded = item.discarded
              tab.xset = true
              tab.xindex = i
              break
            }
          }
        }
      }

      tabs.sort(function (a, b) {
        return a.xindex < b.xindex ? -1 : 1
      })

      for (let [i, tab] of tabs.entries()) {
        try {
          if (tab.pinned) {
            await App.pin_tab(tab.id)
          }
          else {
            await App.unpin_tab(tab.id)
          }

          if (tab.discarded) {
            await App.suspend_tab(tab)
          }

          await App.do_move_tab_index(tab.id, i)
        }
        catch (err) {
          console.error(err)
        }
      }
    }, App.load_tabs_delay)
  }

  if (confirm) {
    App.show_confirm(`Open ${s1} and close ${s2}?`, function () {
      restore()
    })
  }
  else {
    restore()
  }
}

// Get tab state
App.get_tab_state = function () {
  let items = []

  for (let tab of App.tabs_items) {
    let url = App.is_http(tab) ? tab.url : "about"

    items.push({
      url: url,
      pinned: tab.pinned,
      discarded: tab.discarded,
    })
  }

  return items
}

// Open a tab
App.open_tab = async function (url, close = true, args = {}) {
  let opts = {}
  opts.url = url
  opts.active = close
  opts = Object.assign(opts, args)

  let tab = await browser.tabs.create(opts)
  return tab
}

// Uno tabs close
App.undo_close = function () {
  if (!App.tabs_backup) {
    App.show_feedback("Nothing to undo")
  }
  else {
    App.do_load_tab_state(App.tabs_backup)
  }
}

// Backup tab state
App.backup_tabs = function () {
  if (App.backup_tabs_locked) {
    App.unlock_backup_tabs.call()
    return
  }

  App.tabs_backup = App.get_tab_state()
  App.backup_tabs_locked = true
  App.unlock_backup_tabs.call()
  App.stor_save_tab_state()
}

// Get save tab state items
App.get_save_tab_state_items = function () {
  let items = [
    {
      text: "Save on #1",
      action: function () {
        App.save_tab_state(1)
      }
    },
    {
      text: "Save on #2",
      action: function () {
        App.save_tab_state(2)
      }
    },
    {
      text: "Save on #3",
      action: function () {
        App.save_tab_state(3)
      }
    },
    {
      text: "Save on #4",
      action: function () {
        App.save_tab_state(4)
      }
    },
    {
      text: "Save on #5",
      action: function () {
        App.save_tab_state(5)
      }
    }
  ]

  return items
}

// Get load tab state items
App.get_load_tab_state_items = function () {
  let items = [
    {
      text: "Load #1",
      action: function () {
        App.load_tab_state(1)
      }
    },
    {
      text: "Load #2",
      action: function () {
        App.load_tab_state(2)
      }
    },
    {
      text: "Load #3",
      action: function () {
        App.load_tab_state(3)
      }
    },
    {
      text: "Load #4",
      action: function () {
        App.load_tab_state(4)
      }
    },
    {
      text: "Load #5",
      action: function () {
        App.load_tab_state(5)
      }
    }
  ]

  return items
}

// Update tab index
App.update_tab_index = async function () {
  for (let el of App.els(".tabs_item")) {
    let index = App.get_item_element_index("tabs", el)
    await App.do_move_tab_index(parseInt(el.dataset.id), index)
  }
}

// Do tab index move
App.do_move_tab_index = async function (id, index) {
  let ans = await browser.tabs.move(id, {index: index})
  return ans
}

// On tab activated
App.on_tab_activated = async function (e) {
  for (let tab of App.tabs_items) {
    tab.active = false
  }

  await App.refresh_tab(e.tabId, true)
}

// Move tabs
App.move_tabs = async function (item, window_id) {
  let active = App.get_active_items("tabs", item)

  for (let item of active) {
    let index = item.pinned ? 0 : -1
    await browser.tabs.move(item.id, {index: index, windowId: window_id})
  }

  App.close_window()
}

// Open tab in new window
App.detach_tab = function (tab) {
  browser.windows.create({tabId: tab.id, focused: false})
  App.close_window()
}

// Clean tabs
App.clean_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.pinned && !tab.audible) {
      ids.push(tab.id)
    }
  }

  if (ids.length === 0) {
    return
  }

  App.show_confirm(`Clean tabs? (${ids.length})`, function () {
    App.do_close_tabs(ids)
  })
}

// Show playing icon
App.show_playing = function () {
  App.el("#tabs_playing").classList.remove("hidden")
}

// Hide playing icon
App.hide_playing = function () {
  App.el("#tabs_playing").classList.add("hidden")
}

// Check if a tab is playing
App.check_playing = function () {
  let playing = App.get_playing_tabs()

  if (playing.length > 0) {
    App.show_playing()
  }
  else {
    App.hide_playing()
  }
}

// Show the pinline after the last pin
App.show_pinline = function () {
  let last

  App.remove_pinline()

  if (App.get_filter("tabs") || App.tabs_filter_mode !== "all") {
    return
  }

  for (let tab of App.tabs_items) {
    if (tab.pinned) {
      last = tab
    }
    else {
      if (last) {
        last.element.classList.add("pinline")
      }

      break
    }
  }
}

// Check pinline
App.check_pinline = function () {
  if (App.get_filter("tabs") || App.tabs_filter_mode !== "all") {
    App.remove_pinline()
  } else {
    App.show_pinline()
  }
}

// Remove the pinline
App.remove_pinline = function () {
  for (let el of App.els("#tabs_container .pinline")) {
    el.classList.remove("pinline")
  }
}

// Go the a tab emitting sound
App.go_to_playing = function () {
  let tabs = App.tabs_items.slice(0)
  let waypoint = false
  let first

  for (let tab of tabs) {
    if (tab.audible) {
      if (!first) {
        first = tab
      }

      if (waypoint) {
        App.focus_tab(tab)
        return
      }
    }

    if (!waypoint && tab.active) {
      waypoint = true
      continue
    }
  }

  // If none found then pick the first one
  if (first) {
    App.focus_tab(first)
  }
}

// Empty previous tabs
App.do_empty_previous_tabs = function () {
  App.previous_tabs = []
}

// Get previous tabs
App.get_previous_tabs = async function () {
  App.previous_tabs = await App.get_tabs()

  App.previous_tabs.sort(function (a, b) {
    return a.lastAccessed > b.lastAccessed ? -1 : 1
  })

  App.previous_tabs_index = 1
}

// Go to previous tab
App.go_to_previous_tab = async function () {
  if (App.previous_tabs.length === 0) {
    await App.get_previous_tabs()
  }

  App.empty_previous_tabs.call()

  if (App.previous_tabs.length <= 1) {
    return
  }

  App.focus_tab(App.previous_tabs[App.previous_tabs_index])
  App.previous_tabs_index += 1

  if (App.previous_tabs_index >= App.previous_tabs.length) {
    App.previous_tabs_index = 0
  }
}

// Get active tab
App.get_active_tab = async function () {
  let tabs = await browser.tabs.query({currentWindow: true})

  for (let tab of tabs) {
    if (tab.active) {
      return tab
    }
  }
}