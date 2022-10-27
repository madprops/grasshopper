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
  if (!tab) {
    return
  }

  let next_tab

  if (tab === App.selected_tabs_item) {
    next_tab = App.get_next_visible_tab(tab) || App.get_prev_visible_tab(tab)
  }

  tab.closed = true

  if (close_tab) {
    browser.tabs.remove(tab.id)
  }

  App.remove_tab(tab)

  if (next_tab) {
    App.select_item("tabs", next_tab)
  }
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
    App.do_filter_tabs()
  }, App.filter_delay)

  App.ev(App.el("#tabs_filter"), "input", function () {
    App.filter()
  })

  App.ev(App.el("#filter_mode"), "change", function () {
    App.do_filter_tabs()
  })

  App.ev(App.el("#case_sensitive"), "change", function () {
    App.do_filter_tabs()
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

      App.do_filter_tabs({select_new: false})
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
  App.do_filter_tabs({select_new: false})
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
  App.do_filter_tabs(filter_args)
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

// Make tab visible
App.show_tab = function (tab) {
  tab.element.classList.remove("hidden")
}

// Make a tab not visible
App.hide_tab = function (tab) {
  tab.element.classList.add("hidden")
}

// Show tab menu
App.show_tab_menu = function (tab, x, y) {
  let items = []

  if (tab.pinned) {
    items.push({
      text: "Unpin",
      action: function () {
        App.unpin_tab(tab)
      }
    })
  } else {
    items.push({
      text: "Pin",
      action: function () {
        App.pin_tab(tab)
      }
    })
  }

  if (tab.muted) {
    items.push({
      text: "Unmute",
      action: function () {
        App.unmute_tab(tab)
      }
    })
  } else {
    items.push({
      text: "Mute",
      action: function () {
        App.mute_tab(tab)
      }
    })
  }

  items.push({
    text: "Copy URL",
    action: function () {
      App.copy_to_clipboard(tab.url)
    }
  })

  items.push({
    text: "Copy Title",
    action: function () {
      App.copy_to_clipboard(tab.title)
    }
  })

  NeedContext.show(x, y, items)
}

// Remove a tab
App.remove_tab = function (tab) {
  tab.element.remove()

  for (let [i, it] of App.tabs_items.entries()) {
    if (it.id === tab.id) {
      App.tabs_items.splice(i, 1)
      break
    }
  }
}

// Get index of tab
App.get_tab_index = function (tab) {
  for (let [i, it] of App.tabs_items.entries()) {
    if (it === tab) {
      return i
    }
  }

  return -1
}

// Count visible tabs
App.count_visible_tabs = function () {
  return App.tabs_items.filter(x => App.item_is_visible(x)).length
}

// Do tab filter
// Args: select_new
App.do_filter_tabs = function (args = {}) {
  if (args.select_new === undefined) {
    args.select_new = true
  }

  let value = App.el("#tabs_filter").value.trim()
  let filter_mode = App.el("#filter_mode").value

  if (App.tabs_items.length === 0) {
    return
  }
  
  let words = value.split(" ").filter(x => x !== "")
  let case_sensitive = App.el("#case_sensitive").checked
  let filter_words = case_sensitive ? words : words.map(x => x.toLowerCase())

  function check (what) {
    return filter_words.every(x => what.includes(x))
  }

  function matched (tab) {
    let match = false
    let title = case_sensitive ? tab.title : tab.title_lower
    let path = case_sensitive ? tab.path : tab.path_lower
    
    if (filter_mode === "all") {
      match = check(title) || check(path)
    } else if (filter_mode === "title") {
      match = check(title)
    } else if (filter_mode === "url") {
      match = check(path)
    } else if (filter_mode === "playing") {
      match = tab.audible &&
      (check(title) || check(path))    
    } else if (filter_mode === "pins") {
      match = tab.pinned &&
      (check(title) || check(path))  
    } else if (filter_mode === "muted") {
      match = tab.muted &&
      (check(title) || check(path))    
    } else if (filter_mode === "normal") {
      match = !tab.audible && !tab.pinned &&
      (check(title) || check(path)) 
    }
        
    return match
  }

  let selected

  for (let tab of App.tabs_items) {
    if (matched(tab)) {
      App.show_tab(tab)

      if (!selected) {
        if (args.select_tab_id) {
          if (tab.id === args.select_tab_id) {
            selected = tab
            args.select_tab_id = undefined
          }
        } else if (args.select_new) {
          selected = tab
        }
      }
    } else {
      App.hide_tab(tab)
    }
  }

  if (selected) {
    App.select_item("tabs", selected)
  } else {
    App.update_footer()
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