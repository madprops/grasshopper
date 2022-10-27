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
    App.show_closed_tabs()
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
  let tab = App.get_tab_by_id(id)

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
      let tab = App.process_tab(info)

      if (!tab) {
        break
      }

      App.create_tab_element(tab)
      App.tabs_items[i].element.replaceWith(tab.element)
      App.tabs_items[i] = tab

      if (selected) {
        App.select_item("tabs", tab)
      }

      App.do_item_filter("tabs")
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

  let tab = App.process_tab(info)

  if (!tab) {
    return
  }

  App.tabs_items.unshift(tab)
  App.create_tab_element(tab)
  App.el("#tabs").prepend(tab.element)
  App.do_item_filter("tabs")
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
  App.process_tabs(tabs)
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

// When results are found
App.process_tabs = function (tabs) {
  let container = App.el("#tabs")
  container.innerHTML = ""
  App.tabs_items = []

  for (let tab of tabs) {
    let obj = App.process_tab(tab)

    if (!obj) {
      continue
    }

    App.tabs_items.push(obj)
    container.append(obj.element)
  }
}

// Process a tab
App.process_tab = function (tab) {
  if (!tab.url) {
    return false
  }

  tab.url = App.format_url(tab.url)

  try {
    url_obj = new URL(tab.url)
  } catch (err) {
    return
  }

  let path = App.remove_protocol(tab.url)
  let title = tab.title || path

  let obj = {
    id: tab.id,
    title: title,
    title_lower: title.toLowerCase(),
    url: tab.url,
    path: path,
    path_lower: path.toLowerCase(),
    favicon: tab.favIconUrl,
    audible: tab.audible,
    pinned: tab.pinned,
    muted: tab.mutedInfo.muted,
    closed: false,
    empty: false,
    index: tab.index,
    active: tab.active
  }

  App.create_tab_element(obj)
  return obj
}

// Create a tab element
App.create_tab_element = function (tab) {
  tab.element = App.create("div", "item tabs_item")
  tab.element.dataset.id = tab.id

  let icon = App.get_img_icon(tab.favicon, tab.url)
  tab.element.append(icon)

  let text = App.create("div", "item_text")
  tab.element.append(text)
  App.set_tab_text(tab)

  let close = App.create("div", "item_button tabs_close")
  close.textContent = "Close"
  tab.element.append(close)
}

// Set tab text content
App.set_tab_text = function (tab) {
  let content = ""
  let status = []

  if (tab.pinned) {
    status.push("Pin")
  }

  if (tab.audible) {
    status.push("Playing")
  }

  if (tab.muted) {
    status.push("Muted")
  }

  if (status.length > 0) {
    content = status.map(x => `(${x})`).join(" ")
    content += "  "
  }

  let purl

  if (tab.url.startsWith("http://")) {
    purl = tab.url
  } else {
    purl = tab.path
  }

  content += tab.title || purl
  tab.footer = decodeURI(purl) || tab.title

  content = content.substring(0, 200).trim()
  let text = App.el(".item_text", tab.element)
  text.textContent = content
}

// Change tab text mode
App.update_text = function () {
  for (let tab of App.tabs_items) {
    App.set_tab_text(tab)
  }
}

// Get a tab by id dataset
App.get_tab_by_id = function (id) {
  id = parseInt(id)

  for (let tab of App.tabs_items) {
    if (tab.id === id) {
      return tab
    }
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