// Get open tabs
App.get_tabs = async function () {
  let items = await browser.tabs.query({ currentWindow: true })
  items.sort((a, b) => (a.lastAccessed < b.lastAccessed) ? 1 : -1)
  return items
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
  item.closed = true

  if (close_tab) {
    browser.tabs.remove(item.id)
  }

  App.remove_item(item)
}

// Setup tabs
App.setup_tabs = async function () {
  App.ev(App.el("#closed_button"), "click", function () {
    App.show_closed_tabs()
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
App.restore_tab = async function (tab, close = true) {
  await browser.sessions.forgetClosedTab(tab.windowId, tab.sessionId)
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

      App.tab_items[i].element.replaceWith(item.element)
      App.tab_items[i] = item
      App.create_item_element(item)

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
  let item = App.process_item(tab)

  App.tab_items.unshift(item)
  App.el("#tabs").prepend(item.element)
  App.create_item_element(item)
  App.do_filter({select_new: false, disable_mouse_over: false})
}

// Show closed tabs
App.show_closed_tabs = async function () {
  let closed = await browser.sessions.getRecentlyClosed({
    maxResults: 25
  })

  let container = App.create("div", "unselectable", "closed_container")
  let urls = []

  for (let c of closed) {
    if (c.tab) {
      c.tab.url = App.format_url(c.tab.url)

      try {
        url_obj = new URL(c.tab.url)
      } catch (err) {
        continue
      }

      if (urls.includes(c.tab.url)) {
        continue
      }

      urls.push(c.tab.url)
      
      let div = App.create("div", "closed_item")
      let icon = App.get_img_icon(c.tab.favIconUrl)

      div.append(icon)
      let text = App.create("div")
      text.textContent = c.tab.title
      div.append(text)
      div.title = c.tab.url
      
      App.ev(div, "click", function () {
        App.restore_tab(c.tab)
      })

      App.ev(div, "auxclick", function (e) {
        if (e.button === 1) {
          App.restore_tab(c.tab, false)
          div.remove()
        }
      })

      container.append(div)
    }
  }

  App.show_window_2(container)
}

// Remove item of a closed tab
App.clean_closed_tab = function (id) {
  let item = App.get_item_by_id(id)

  if (item) {
    App.close_tab(item, false)
  }
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
    if (!it.status.includes("pinned")) {
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

// Show tabs
App.show_tabs = async function () {
  let tabs = await App.get_tabs()
  App.process_items(tabs)
  App.do_filter()
}