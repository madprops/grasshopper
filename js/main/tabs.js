// Get open tabs
App.get_tabs = async function () {
  let tabs = await browser.tabs.query({currentWindow: true})
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
App.open_tab = function (tab, close = true) {
  browser.tabs.update(tab.id, {active: close})

  if (close) {
    window.close()
  }
}

// Close tab with possible confirm
App.confirm_close_tab = function (tab) {
  if (tab.audible) {
    if (confirm("Close playing tab?")) {
      App.close_tab(tab)
    }
  } else if (tab.pinned) {
    if (confirm("Close pinned tab?")) {
      App.close_tab(tab)
    }
  } else {
    App.close_tab(tab)
  }
}

// Close a tab
App.close_tab = function (tab, close_tab = true) {
  if (!tab || tab.closed) {
    return
  }

  if (close_tab) {
    browser.tabs.remove(tab.id)
  }

  App.remove_item("tabs", tab)
}

// Setup tabs
App.setup_tabs = function () {
  App.ev(App.el("#clean_button"), "click", function () {
    App.clean_tabs()
  })

  App.ev(App.el("#closed_button"), "click", function () {
    App.show_window("closed_tabs")
  })

  App.ev(App.el("#playing_button"), "click", function () {
    App.go_to_playing_tab()
  })

  App.ev(App.el("#new_button"), "click", function () {
    App.new_tab()
  })

  browser.tabs.onUpdated.addListener(function (id) {
    App.refresh_tab(id)
  })

  browser.tabs.onRemoved.addListener(function (id) {
    App.clean_closed_tab(id)
  })

  App.filter = App.create_debouncer(function () {
    App.do_item_filter("tabs")
  }, App.filter_delay)

  App.ev(App.el("#tabs_filter"), "input", function () {
    App.filter()
  })

  App.ev(App.el("#tabs_filter_mode"), "change", function () {
    App.do_item_filter("tabs")
  })

  App.ev(App.el("#tabs_case_sensitive"), "change", function () {
    App.do_item_filter("tabs")
  })    
}

// Restore a closed tab
App.restore_tab = function (tab, close = true) {
  browser.sessions.forgetClosedTab(tab.window_id, tab.session_id)
  browser.tabs.create({url: tab.url, active: close})

  if (close) {
    window.close()
  }
}

// Open a new tab
App.new_tab = function () {
  browser.tabs.create({active: true})
  window.close()
}

// Refresh tabs
App.refresh_tab = async function (id) {
  let tab = App.get_item_by_id("tabs", id)

  if (!tab) {
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
      let selected = App.selected_tabs_item === it
      let tab = App.process_item("tabs", info)

      if (!tab) {
        break
      }

      App.create_item_element("tabs", tab)
      App.tabs_items[i].element.replaceWith(tab.element)
      App.tabs_items[i] = tab

      if (selected) {
        App.select_item("tabs", tab)
      }

      App.do_item_filter("tabs", false)
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
  App.el("#tabs_container").prepend(tab.element)
  App.do_item_filter("tabs", false)
}

// Close all tabs except pinned and audible tabs
App.clean_tabs = function () {
  let tabs = []

  for (let it of App.tabs_items) {
    if (it.pinned || it.audible) {
      continue
    }

    tabs.push(it)
  }

  App.confirm_tabs_close(tabs)
}

// Confirm tab close
App.confirm_tabs_close = function (tabs) {
  if (tabs.length === 0) {
    return
  }

  let num_tabs = 0

  for (let tab of tabs) {
    if (tab.url !== "about:newtab") {
      num_tabs += 1
    }
  }

  if (num_tabs > 0) {
    let s = App.plural(num_tabs, "tab", "tabs")

    if (confirm(`Close ${s}?`)) {
      for (let tab of tabs) {
        App.close_tab(tab)
      }
    }
  } else {
    for (let tab of tabs) {
      App.close_tab(tab)
    }
  }
}

// Pin a tab
App.pin_tab = function (tab) {
  browser.tabs.update(tab.id, {pinned: true})
}

// Unpin a tab
App.unpin_tab = function (tab) {
  browser.tabs.update(tab.id, {pinned: false})
}

// Mute a tab
App.mute_tab = function (tab) {
  browser.tabs.update(tab.id, {muted: true})
}

// Unmute a tab
App.unmute_tab = function (tab) {
  browser.tabs.update(tab.id, {muted: false})
}

// Show tabs
App.show_tabs = async function (filter_args = {}) {
  let tabs = await App.get_tabs()
  App.process_items("tabs", tabs)
  App.do_item_filter("tabs")
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
        App.open_tab(tab)
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
    App.open_tab(first)
  }
}

// Close all tabs
App.close_all_tabs = async function () {
  if (confirm("Close all tabs?")) {
    for (let tab of App.tabs_items) {
      if (tab.active) {
        continue
      }
      
      browser.tabs.remove(tab.id)
    }

    window.close()
  }
}

// Return pinned tabs
App.get_pinned_tabs = function () {
  return App.tabs_items.filter(x => x.pinned)
}

// Remove a closed tab
App.clean_closed_tab = function (id) {
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    App.close_tab(tab, false)
  }
}

// Tabs action
App.tabs_action = function () {
  App.open_tab(App.selected_tabs_item)
  e.preventDefault()
}