// Setup tabs
App.setup_tabs = function () {
  App.tabs_filter_modes = [
    ["all", "All"],
    ["pins", "Pins"],
    ["normal", "Normal"],
    ["playing", "Playing"],
    ["muted", "Muted"],
    ["suspended", "Suspended"],
    ["secure", "Secure"],
    ["insecure", "Insecure"],
    ["this_window", "This Window"],
    ["other_window", "Other Window"]
  ]

  let menu_items = [
    ["New Tab", function () {
      App.new_tab()
    }], 

    ["Go To Playing", function () {
      App.go_to_playing_tab()
    }],

    ["Information", function () {
      App.show_tabs_information()
    }],

    ["Pin/Unpin...", undefined, [
    {
      text: "Pin All",
      action: function () {
        App.pin_all_tabs()
      }
    },
    {
      text: "Unpin All",
      action: function () {
        App.unpin_all_tabs()
      }
    }
    ]],

    ["Mute/Unmute...", undefined, [
    {
      text: "Mute Playing",
      action: function () {
        App.mute_tabs()
      }
    },
    {
      text: "Unmute Muted",
      action: function () {
        App.unmute_tabs()
      }
    }
    ]],

    ["Suspend...", undefined, [
    {
      text: "Suspend Normal",
      action: function () {
        App.suspend_tabs("normal")
      }
    },
    {
      text: "Suspend Pins",
      action: function () {
        App.suspend_tabs("pinned")
      }
    },
    {
      text: "Suspend All",
      action: function () {
        App.suspend_tabs("all")
      }
    }
    ]],

    ["Close...", undefined, [
    {
      text: "Close Normal",
      action: function () {
        App.close_normal_tabs()
      }
    },
    {
      text: "Close Playing",
      action: function () {
        App.close_playing_tabs()
      }
    },
    {
      text: "Close Suspended",
      action: function () {
        App.close_suspended_tabs()
      }
    },
    {
      text: "Close Pins",
      action: function () {
        App.close_pinned_tabs()
      }
    },
    {
      text: "Close All",
      action: function () {
        App.close_tabs()
      }
    }
    ]],
  ]

  App.setup_item_window("tabs", menu_items)

  browser.tabs.onUpdated.addListener(function (id) {
    if (App.window_mode === "tabs") {
      App.refresh_tab(id)
    }
  })

  browser.tabs.onActivated.addListener(function (ans) {
    if (App.window_mode === "tabs") {
      for (let tab of App.tabs_items) {
        tab.active = false
      }

      App.refresh_tab(ans.tabId)
    }
  })  
  
  browser.tabs.onRemoved.addListener(function (id) {
    if (App.window_mode === "tabs") {
      App.remove_closed_tab(id)
    }
  })
}

// Get open tabs
App.get_tabs = async function () {
  let tabs = []

  if (!App.settings.all_windows) {
    tabs = await browser.tabs.query({currentWindow: true})
  } else {
    let wins = await browser.windows.getAll({populate: true})

    for (let win of wins) {
      for (let tab of win.tabs) {
        tabs.push(tab)
      }
    }
  }

  App.sort_tabs_by_access(tabs)
  return tabs  
}

// Sort tabs by access
App.sort_tabs_by_access = function (tabs) {
  tabs.sort((a, b) => (a.lastAccessed < b.lastAccessed) ? 1 : -1)
}

// Sort tabs by index
App.sort_tabs_by_index = function (tabs) {
  tabs.sort((a, b) => (a.index > b.index) ? 1 : -1)
}

// Open a new tab
App.focus_tab = async function (tab, close = true) {
  if (tab.window_id) {
    await browser.windows.update(tab.window_id, {focused: true})
  }

  await browser.tabs.update(tab.id, {active: true})

  if (close) {
    window.close()
  }
}

// Close tab with possible confirm
App.confirm_close_tab = function (tab) {
  if (!App.tab_is_normal(tab)) {
    let s

    if (tab.audible) {
      s = "Close playing tab?"
    } else if (tab.pinned) {
      s = "Close pinned tab?"
    } else {
      s = "Close tab?"
    }

    if (!confirm(s)) {
      return
    }
  }
  
  App.close_tab(tab.id)
}

// Close a tab
App.close_tab = function (id) {
  browser.tabs.remove(id)
}

// Open a new tab
App.new_tab = function (url = undefined) {
  browser.tabs.create({active: true, url: url})
  window.close()
}

// Refresh tabs
App.refresh_tab = async function (id) {
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    if (tab.closed) {
      return
    }
  } else {
    App.tabs_items.push({
      id: id,
      empty: true
    })
  }

  let info = await browser.tabs.get(id)

  if (tab) {
    App.update_item("tabs", tab.id, info)
  } else {
    App.prepend_tab(info)
  }
}

// Prepend tab to the top
App.prepend_tab = function (info) {
  for (let [i, it] of App.tabs_items.entries()) {
    if (it.id === info.id) {
      if (it.empty) {
        App.tabs_items.splice(i, 1)
        break
      }
    }
  }
  
  let tab = App.process_item("tabs", info)
  
  if (!tab) {
    return
  }
  
  App.tabs_items.unshift(tab)
  App.create_item_element(tab)
  App.update_info("tabs")
  App.el("#tabs_container").prepend(tab.element)
}

// Pin a tab
App.pin_tab = function (id) {
  browser.tabs.update(id, {pinned: true})
}

// Unpin a tab
App.unpin_tab = function (id) {
  browser.tabs.update(id, {pinned: false})
}

// Mute a tab
App.mute_tab = function (id) {
  browser.tabs.update(id, {muted: true})
}

// Unmute a tab
App.unmute_tab = function (id) {
  browser.tabs.update(id, {muted: false})
}

// Go the a tab emitting sound
// Traverse in tab index order
App.go_to_playing_tab = function () {
  let tabs = App.tabs_items.slice(0)
  App.sort_tabs_by_index(tabs)
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
App.tabs_action_alt = function (item, shift_key) {
  if (shift_key) {
    App.close_tab(item.id)
  } else {
    App.confirm_close_tab(item)
  }
}

// Open tab in new window
App.detach_tab = async function (tab) {
  browser.windows.create({tabId: tab.id})
  window.close()
}

// Move tab to another existing window
App.move_tab = async function (tab, window_id) {
  await browser.tabs.move(tab.id, {index: -1, windowId: window_id})
  browser.tabs.update(tab.id, {active: true})
  window.close()
}

// Duplicate a tab
App.duplicate_tab = function (tab) {
  browser.tabs.create({active: true, url: tab.url})
  window.close()
}

// Suspend a tab
App.suspend_tab = async function (tab) {
  if (tab.active) {
    await browser.tabs.create({active: true})
  }

  browser.tabs.discard(tab.id)
}

// Pin tabs
App.pin_all_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || tab.pinned) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Pin tabs? (${s})`)) {
    for (let id of ids) {
      App.pin_tab(id)
    }
  }  
}

// Unpin tabs
App.unpin_all_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.pinned) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Unpin tabs? (${s})`)) {
    for (let id of ids) {
      App.unpin_tab(id)
    }
  }  
}

// Suspend normal tabs
App.suspend_tabs = function (type) {
  let tabs = []

  for (let tab of App.tabs_items) {
    if (!tab.visible) {
      continue
    }

    if (!App.is_http(tab)) {
      continue
    }

    if (type === "normal") {
      if (tab.discarded || tab.pinned || tab.audible) {
        continue
      }
    } else if (type === "pinned") {
      if (!tab.pinned) {
        continue
      }
    }
    
    tabs.push(tab)
  }

  if (tabs.length === 0) {
    return
  }
  
  let s = App.plural(tabs.length, "tab", "tabs")

  if (confirm(`Suspend tabs? (${s})`)) {
    for (let tab of tabs) {
      App.suspend_tab(tab)
    }
  }  
}

// Close playing tabs
App.close_playing_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.audible) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Close playing tabs? (${s})`)) {
    for (let id of ids) {
      App.close_tab(id)
    }
  }
}

// Close suspended tabs
App.close_suspended_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.discarded) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Close suspended tabs? (${s})`)) {
    for (let id of ids) {
      App.close_tab(id)
    }
  }
}

// Close normal tabs
App.close_normal_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !App.tab_is_normal(tab)) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Close normal tabs? (${s})`)) {
    for (let id of ids) {
      App.close_tab(id)
    }
  }
}

// Close pinned tabs
App.close_pinned_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.pinned) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Close pinned tabs? (${s})`)) {
    for (let id of ids) {
      App.close_tab(id)
    }
  }
}

// Close tabs
App.close_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Close tabs? (${s})`)) {
    for (let id of ids) {
      App.close_tab(id)
    }
  }
}

// Mute tabs
App.mute_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.audible || tab.muted) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Mute playing tabs? (${s})`)) {
    for (let id of ids) {
      App.mute_tab(id)
    }
  }
}

// Unmute tabs
App.unmute_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.muted) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Unmute muted tabs? (${s})`)) {
    for (let id of ids) {
      App.unmute_tab(id)
    }
  }
}

// Check if tab is normal
App.tab_is_normal = function (tab) {
  let special = tab.pinned || tab.audible || tab.discarded
  return !special
}

// Show tabs information
App.show_tabs_information = async function () {
  let all = App.tabs_items.length
  let pins = App.get_pinned_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let suspended = App.get_suspended_tabs().length
  let windows = await browser.windows.getAll({populate: false})

  let s = "Tab Count:\n\n"

  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
  s += `Playing: ${playing}\n`
  s += `Muted: ${muted}\n`
  s += `Suspended: ${suspended}\n`
  s += `Windows: ${windows.length}`

  alert(s)
}

// Pin or unpin
App.toggle_pin = function (item) {
  if (item.pinned) {
    App.unpin_tab(item.id)
  } else {
    App.pin_tab(item.id)
  }
}