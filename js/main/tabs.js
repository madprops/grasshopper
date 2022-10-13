// Get open tabs
App.get_tabs = async function (sort) {
  let tabs = await browser.tabs.query({ currentWindow: true })

  if (sort) {
    App.sort_tabs_by_access(tabs)
  }
  
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

// Open a new tab with a url
App.open_tab = function (item, close = true) {
  browser.tabs.update(item.id, {active: close})

  if (close) {
    window.close()
  }
}

// Close a tab
App.close_tab = function (item, close_tab = true) {
  if (!item) {
    return
  }

  let next_item

  if (item === App.selected_item) {
    next_item = App.get_next_visible_item(item) || App.get_prev_visible_item(item)
  }  

  item.closed = true

  if (close_tab) {
    browser.tabs.remove(item.id)
  }

  App.remove_item(item)

  if (next_item) {
    App.select_item({item: next_item, disable_mouse_over: true})
  }  
}

// Setup tabs
App.setup_tabs = async function () {
  App.ev(App.el("#sort_button"), "click", function () {
    App.sort_tabs()
  })

  App.ev(App.el("#clean_button"), "click", function () {
    App.close_unpinned_tabs()
  })

  App.ev(App.el("#closed_button"), "click", function () {
    App.show_closed_tabs()
  })

  App.ev(App.el("#playing_button"), "click", function () {
    App.go_to_playing_tab()
  })

  browser.tabs.onUpdated.addListener(function (id) {
    App.refresh_tab(id)
  })

  browser.tabs.onRemoved.addListener(function (id) {
    App.clean_closed_tab(id)
  })  
}

// Restore a closed tab
App.restore_tab = async function (tab, close = true) {
  await browser.sessions.forgetClosedTab(tab.window_id, tab.session_id)
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
  let item = App.get_item_by_id(id)

  if (!item) {
    App.tab_items.push({
      id: id,
      empty: true
    })
  }

  let info = await browser.tabs.get(id)

  if (item) {
    App.update_tab(item, info)
  } else {
    App.prepend_tab(info)
  }
}

// Update a tab
App.update_tab = function (item, info) {
  for (let [i, it] of App.tab_items.entries()) {
    if (it.id === item.id) {
      let selected = App.selected_item === it
      let item = App.process_item(info)

      if (!item) {
        break
      }

      App.create_item_element(item)
      App.tab_items[i].element.replaceWith(item.element)
      App.tab_items[i] = item

      if (selected) {
        App.select_item({item: item})
      }
            
      App.do_filter({select_new: false, disable_mouse_over: false})
      break
    }
  }
}

// Prepend tab to the top
App.prepend_tab = function (tab) {
  for (let [i, it] of App.tab_items.entries()) {
    if (it.id === tab.id) {
      if (it.empty) {
        App.tab_items.splice(i, 1)
        break
      }
    }
  }

  let item = App.process_item(tab)

  if (!item) {
    return
  }

  App.tab_items.unshift(item)
  App.create_item_element(item)
  App.el("#tabs").prepend(item.element)
  App.do_filter({select_new: false, disable_mouse_over: false})
}

// Close tabs above
App.close_tabs_above = function (item) {
  let tabs = []

  for (let it of App.tab_items) {
    if (it !== item) {
      tabs.push(it)
    } else {
      break
    }
  }
  
  App.confirm_tabs_close(tabs)
}

// Close tabs below
App.close_tabs_below = function (item) {
  let tabs = []
  let waypoint = false

  for (let it of App.tab_items) {
    if (waypoint) {
      tabs.push(it)
    } else if (it === item) {
      waypoint = true
    }
  }
  
  App.confirm_tabs_close(tabs)
}

// Close other tabs
App.close_other_tabs = function (item) {
  let tabs = []

  for (let it of App.tab_items) {
    if (it !== item) {
      tabs.push(it)
    }
  }
  
  App.confirm_tabs_close(tabs)
}

// Close all tabs except pins
App.close_unpinned_tabs = function () {
  let tabs = []

  for (let it of App.tab_items) {
    if (!it.pinned) {
      tabs.push(it)
    }
  }
  
  App.confirm_tabs_close(tabs)  
}

// Confirm tab close
App.confirm_tabs_close = async function (tabs) {
  if (tabs.length === 0) {
    return
  }

  let s = App.plural(tabs.length, "tab", "tabs")

  if (confirm(`Close ${s}?`)) {
    for (let tab of tabs) {
      App.close_tab(tab)
    }
  }
}

// Pin a tab
App.pin_tab = function (item) {
  browser.tabs.update(item.id, {pinned: true})
}

// Unpin a tab
App.unpin_tab = function (item) {
  browser.tabs.update(item.id, {pinned: false})
}

// Mute a tab
App.mute_tab = function (item) {
  browser.tabs.update(item.id, {muted: true})
}

// Unmute a tab
App.unmute_tab = function (item) {
  browser.tabs.update(item.id, {muted: false})
}

// Show tabs
App.show_tabs = async function (sort = true, filter_args = {}) {
  let tabs = await App.get_tabs(sort)
  App.process_items(tabs)
  App.do_filter(filter_args)
}

// Sort tabs
App.sort_tabs = function () {
  App.show_tabs(App.sorted)
  App.sorted = !App.sorted
}

// Go the a tab emitting sound
// Traverse in tab index order
App.go_to_playing_tab = function () {
  let tabs = App.tab_items.slice(0)
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

// Move tab up
App.move_tab_up = function (tab) {
  if (tab.index > 0) {
    browser.tabs.move(tab.id, {index: tab.index - 1})
  }

  App.show_tabs(false, {
    select_tab_id: tab.id,
    disable_mouse_over: true
  })
}

// Move tab down
App.move_tab_down = function (tab) {
  browser.tabs.move(tab.id, {index: tab.index + 1})
  App.show_tabs(false, {
    select_tab_id: tab.id,
    disable_mouse_over: true
  })
}