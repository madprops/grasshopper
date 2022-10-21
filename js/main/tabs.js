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

// Open a new tab
App.open_tab = function (tab, close = true) {
  browser.tabs.update(tab.id, {active: close})

  if (close) {
    window.close()
  }
}

// Close a tab
App.close_tab = function (tab, close_tab = true) {
  if (!tab) {
    return
  }

  if (tab.audible) {
    if (!confirm("Close playing tab?")) {
      return
    }
  }

  let next_tab

  if (tab === App.selected_tab) {
    next_tab = App.get_next_visible_tab(tab) || App.get_prev_visible_tab(tab)
  }  

  tab.closed = true

  if (close_tab) {
    browser.tabs.remove(tab.id)
  }

  App.remove_tab(tab)

  if (next_tab) {
    App.select_tab({tab: next_tab, disable_mouse_over: true})
  }  
}

// Setup tabs
App.setup_tabs = function () {
  let text_mode = App.el("#text_mode")
  text_mode.value = App.state.text_mode

  App.ev(text_mode, "change", function () {
    App.state.text_mode = text_mode.value
    App.update_text()
    App.save_state()
  })

  NeedContext.after_hide = function () {
    App.flash_mouse_over()
  }

  App.ev(App.el("#sort_button"), "click", function () {
    App.sort_tabs()
  })

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
    App.tabs.push({
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
  for (let [i, it] of App.tabs.entries()) {
    if (it.id === o_tab.id) {
      let selected = App.selected_tab === it
      let tab = App.process_tab(info)

      if (!tab) {
        break
      }

      App.create_tab_element(tab)
      App.tabs[i].element.replaceWith(tab.element)
      App.tabs[i] = tab

      if (selected) {
        App.select_tab({tab: tab})
      }
            
      App.do_filter({select_new: false, disable_mouse_over: false})
      break
    }
  }
}

// Prepend tab to the top
App.prepend_tab = function (info) {
  for (let [i, it] of App.tabs.entries()) {
    if (it.id === info.id) {
      if (it.empty) {
        App.tabs.splice(i, 1)
        break
      }
    }
  }

  let tab = App.process_tab(info)

  if (!tab) {
    return
  }

  App.tabs.unshift(tab)
  App.create_tab_element(tab)
  App.el("#tabs").prepend(tab.element)
  App.do_filter({select_new: false, disable_mouse_over: false})
}

// Close tabs above
App.close_tabs_above = function (tab) {
  let tabs = []

  for (let it of App.tabs) {
    if (it !== tab) {
      if (it.audible) {
        continue
      }

      tabs.push(it)
    } else {
      break
    }
  }
  
  App.confirm_tabs_close(tabs)
}

// Close tabs below
App.close_tabs_below = function (tab) {
  let tabs = []
  let waypoint = false

  for (let it of App.tabs) {
    if (waypoint) {
      if (it.audible) {
        continue
      }

      tabs.push(it)
    } else if (it === tab) {
      waypoint = true
    }
  }
  
  App.confirm_tabs_close(tabs)
}

// Close other tabs
App.close_other_tabs = function (tab) {
  let tabs = []

  for (let it of App.tabs) {
    if (it !== tab) {
      if (it.audible) {
        continue
      }

      tabs.push(it)
    }
  }
  
  App.confirm_tabs_close(tabs)
}

// Close all tabs except pinned and audible tabs
App.clean_tabs = function () {
  let tabs = []

  for (let it of App.tabs) {
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
App.show_tabs = async function (sort = true, filter_args = {}) {
  let tabs = await App.get_tabs(sort)
  App.process_tabs(tabs)
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
  let tabs = App.tabs.slice(0)
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

// When results are found
App.process_tabs = function (tabs) {
  let container = App.el("#tabs")
  container.innerHTML = ""
  App.tabs = []

  for (let tab of tabs) {
    let obj = App.process_tab(tab)
    
    if (!obj) {
      continue
    }  
    
    App.tabs.push(obj)
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

  let icon = App.get_img_icon(tab.favicon)
  tab.element.append(icon)

  let text = App.create("div", "item_text")
  tab.element.append(text)
  App.set_tab_text(tab)

  let close = App.create("div", "item_button tabs_close")
  close.textContent = "Close"
  tab.element.append(close)
}

// Get image favicon
App.get_img_icon = function (favicon) {
  let icon_container = App.create("div", "item_icon_container")
  let icon = App.create("img", "item_icon")
  icon.loading = "lazy"
  icon.width = 25
  icon.height = 25

  App.ev(icon, "error", function () {
    this.classList.add("invisible")
  })

  icon.src = favicon

  icon_container.append(icon)
  return icon_container
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

  if (App.state.text_mode === "title") {
    content += tab.title || purl
    tab.footer = purl || tab.title
  } else if (App.state.text_mode === "url") {
    content += purl || tab.title
    tab.footer = tab.title || purl
  }  
  
  content = content.substring(0, 200).trim()
  let text = App.el(".item_text", tab.element)
  text.textContent = content
}

// Change tab text mode
App.update_text = function () {
  for (let tab of App.tabs) {
    App.set_tab_text(tab)
  }
}

// Get next tab that is visible
App.get_next_visible_tab = function (o_tab) {
  let waypoint = false

  if (!App.selected_valid()) {
    waypoint = true
  }

  for (let i=0; i<App.tabs.length; i++) {
    let tab = App.tabs[i]

    if (waypoint) {
      if (App.tab_is_visible(tab)) {
        return tab
      }
    }

    if (tab === o_tab) {
      waypoint = true
    }
  }
}

// Get prev tab that is visible
App.get_prev_visible_tab = function (o_tab) {
  let waypoint = false

  if (!App.selected_valid()) {
    waypoint = true
  }  

  for (let i=App.tabs.length-1; i>=0; i--) {
    let tab = App.tabs[i]

    if (waypoint) {
      if (App.tab_is_visible(tab)) {
        return tab
      }
    }

    if (tab === o_tab) {
      waypoint = true
    }
  }
}

// Get a tab by id dataset
App.get_tab_by_id = function (id) {
  id = parseInt(id)

  for (let tab of App.tabs) {
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

// Make a tab selected
// Unselect all the others
// Args: tab, scroll, disable_mouse_over
App.select_tab = function (args) {
  if (args.scroll === undefined) {
    args.scroll = true
  }
  
  if (args.disable_mouse_over === undefined) {
    args.disable_mouse_over = false
  }  

  if (args.tab.closed) {
    return
  }
  
  if (args.disable_mouse_over) {
    App.disable_mouse_over()
  }

  for (let el of App.els(".selected")) {
    el.classList.remove("selected")
  }

  App.selected_tab = args.tab
  App.selected_tab.element.classList.add("selected")

  if (args.scroll) {
    App.selected_tab.element.scrollIntoView({block: "nearest"})
  }

  App.update_footer()
  browser.tabs.warmup(args.tab.id)

  if (args.disable_mouse_over) {
    App.enable_mouse_over()
  }
}

// Check if a tab is visible
App.tab_is_visible = function (tab) {
  let hidden = tab.element.classList.contains("hidden")
  return !hidden
}

// Update the footer
App.update_footer = function () {
  if (App.selected_valid()) {
    App.el("#footer").textContent = App.selected_tab.footer
  } else {
    App.el("#footer").textContent = "No Results"
  }
}

// Show tab menu
App.show_tab_menu = function (tab, x, y) {
  let items = []
  let index = App.get_tab_index(tab)

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

  items.push({
    text: "Move Up",
    action: function () {
      App.move_tab_up(tab)
    }
  })

  items.push({
    text: "Move Down",
    action: function () {
      App.move_tab_down(tab)
    }
  })

  if (index >= 0) {
    if (index > 0) {
      items.push({
        text: "Close Above",
        action: function () {
          App.close_tabs_above(tab)
        }
      })
    }

    if (index < App.tabs.length - 1) {
      items.push({
        text: "Close Below",
        action: function () {
          App.close_tabs_below(tab)
        }
      })   
    }
  }

  if (App.tabs.length > 1) {
    items.push({
      text: "Close Others",
      action: function () {
        App.close_other_tabs(tab)
      }
    })    
  }

  NeedContext.show(x, y, items)
}

// Remove a tab
App.remove_tab = function (tab) {
  tab.element.remove()

  for (let [i, it] of App.tabs.entries()) {
    if (it.id === tab.id) {
      App.tabs.splice(i, 1)
      break
    }
  }
}

// Select tab above
App.select_tab_above = function () {
  let tab = App.get_prev_visible_tab(App.selected_tab)

  if (tab) {
    App.select_tab({tab: tab, disable_mouse_over: true})
  }
}

// Select tab below
App.select_tab_below = function () {
  let tab = App.get_next_visible_tab(App.selected_tab)

  if (tab) {
    App.select_tab({tab: tab, disable_mouse_over: true})
  }
}

// Check if selected is valid
App.selected_valid = function () {
  return App.selected_tab && !App.selected_tab.closed && App.tab_is_visible(App.selected_tab)
}

// Get index of tab
App.get_tab_index = function (tab) {
  for (let [i, it] of App.tabs.entries()) {
    if (it === tab) {
      return i
    }
  }

  return -1
}

// Count visible tabs
App.count_visible_tabs = function () {
  return App.tabs.filter(x => App.tab_is_visible(x)).length
}