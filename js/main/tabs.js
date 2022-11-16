// Setup tabs
App.setup_tabs = function () {
  App.setup_item_window("tabs")

  App.ev(App.el("#tabs_playing_button"), "click", function () {
    App.go_to_playing_tab()
  })

  App.ev(App.el("#tabs_clean_button"), "click", function () {
    App.clean_tabs()
  })  

  App.ev(App.el("#tabs_more_button"), "click", function () {
    App.show_tabs_menu()
  })

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
  if (App.settings.warn_on_tab_close) {
    if (tab.audible) {
      if (confirm("Close playing tab?")) {
        App.close_tab(tab.id)
      }
    } else if (tab.pinned) {
      if (confirm("Close pinned tab?")) {
        App.close_tab(tab.id)
      }
    } else {
      App.close_tab(tab.id)
    }
  } else {
    App.close_tab(tab.id)
  }
}

// Close a tab
App.close_tab = function (id) {
  browser.tabs.remove(id)
}

// Open a new tab
App.new_tab = function () {
  browser.tabs.create({active: true})
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
    App.update_tab(tab, info)
  } else {
    App.prepend_tab(info)
  }
}

// Update a tab
App.update_tab = function (o_tab, info) {
  for (let [i, it] of App.tabs_items.entries()) {
    if (it.id === o_tab.id) {
      let tab = App.process_item("tabs", info)
      
      if (!tab) {
        break
      }

      if (!App.item_is_visible(it)) {
        App.hide_item(tab)
      }
      
      let selected = App.selected_tabs_item === it
      App.create_item_element("tabs", tab)
      App.tabs_items[i].element.replaceWith(tab.element)
      App.tabs_items[i] = tab

      if (selected) {
        App.select_item("tabs", tab)
      }

      break
    }
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
  App.create_item_element("tabs", tab)
  App.update_info("tabs")
  App.el("#tabs_container").prepend(tab.element)
}

// Close all normal tabs
App.clean_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (tab.pinned || tab.audible || tab.active || tab.discarded) {
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

// Remove a closed tab
App.remove_closed_tab = function (id) {
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    App.remove_item("tabs", tab)
  }

  App.update_info("tabs")
}

// Tabs action
App.tabs_action = function (item) {
  App.focus_tab(item)
}

// Tabs action alt
App.tabs_action_alt = function (item) {
  App.confirm_close_tab(item)
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

// Show tabs menu
App.show_tabs_menu = function () {
  let items = []

  items.push({
    text: "New Tab",
    action: function () {
      App.new_tab()
    }
  })  

  let has_pinned = false
  let has_unpinned = false
  let has_suspended = false
  let has_unsuspended = false
  let has_filter = App.el("#tabs_filter").value.trim()
  
  for (let tab of App.tabs_items) {
    if (tab.pinned) {
      has_pinned = true
    } else {
      has_unpinned = true
    }

    if (tab.discarded) {
      has_suspended = true
    } else {
      has_unsuspended = true
    }
  }

  if (has_unpinned) {
    items.push({
      text: "Pin All Tabs",
      action: function () {
        App.pin_all_tabs()
      }
    })
  }

  if (has_pinned) {
    items.push({
      text: "Unpin All Tabs",
      action: function () {
        App.unpin_all_tabs()
      }
    })
  }

  if (has_unsuspended) {
    items.push({
      text: "Suspend All Tabs",
      action: function () {
        App.suspend_tabs(false)
      }
    })  

    items.push({
      text: "Suspend Normal Tabs",
      action: function () {
        App.suspend_tabs()
      }
    })
  }

  if (has_suspended) {
    items.push({
      text: "Close Suspended Tabs",
      action: function () {
        App.close_suspended_tabs()
      }
    })
  }

  if (has_filter) {
    items.push({
      text: "Close All Filtered Tabs",
      action: function () {
        App.close_filtered_tabs(false)
      }
    })  

    items.push({
      text: "Close Normal Filtered Tabs",
      action: function () {
        App.close_filtered_tabs()
      }
    })  
    
    if (has_unsuspended) {
      items.push({
        text: "Suspend All Filtered Tabs",
        action: function () {
          App.suspend_filtered_tabs(false)
        }
      }) 

      items.push({
        text: "Suspend Normal Filtered Tabs",
        action: function () {
          App.suspend_filtered_tabs()
        }
      }) 
    }
  }

  NeedContext.show_on_element(App.el("#tabs_more_button"), items)
}

// Pin all the tabs
App.pin_all_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (tab.pinned) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Pin all tabs? (${s})`)) {
    for (let id of ids) {
      App.pin_tab(id)
    }
  }  
}

// Unpin all the tabs
App.unpin_all_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.pinned) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Unpin all tabs? (${s})`)) {
    for (let id of ids) {
      App.unpin_tab(id)
    }
  }  
}

// Suspend normal tabs
App.suspend_tabs = function (normal = true) {
  let tabs = []

  for (let tab of App.tabs_items) {
    if (!App.is_http(tab)) {
      continue
    }

    if (normal) {
      if (tab.discarded || tab.pinned || tab.audible) {
        continue
      }
    }
    
    tabs.push(tab)
  }

  if (tabs.length === 0) {
    return
  }
  
  let s = App.plural(tabs.length, "tab", "tabs")

  if (confirm(`Suspend normal tabs? (${s})`)) {
    for (let tab of tabs) {
      App.suspend_tab(tab)
    }
  }  
}

// Close all suspended tabs
App.close_suspended_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.discarded) {
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

// Close tabs that appear after a filter
App.close_filtered_tabs = function (normal = true) {
  let ids = []

  for (let tab of App.tabs_items) {
    if (normal) {
      if (tab.pinned || tab.audible || tab.active || tab.discarded) {
        continue
      }
    }

    if (!App.item_is_visible(tab)) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  if (confirm(`Close filtered tabs? (${s})`)) {
    for (let id of ids) {
      App.close_tab(id)
    }
  }
}

// Close tabs that appear after a filter
App.suspend_filtered_tabs = function (normal = true) {
  let tabs = []

  for (let tab of App.tabs_items) {
    if (!App.is_http(tab)) {
      continue
    }

    if (normal) {
      if (tab.discarded || tab.pinned || tab.audible) {
        continue
      }
    }

    if (!App.item_is_visible(tab)) {
      continue
    }
    
    tabs.push(tab)
  }

  if (tabs.length === 0) {
    return
  }
  
  let s = App.plural(tabs.length, "tab", "tabs")

  if (confirm(`Close filtered tabs? (${s})`)) {
    for (let tab of tabs) {
      App.suspend_tab(tab)
    }
  }
}