// Get list of open tabs
App.get_tabs = async function () {
  let items = await browser.tabs.query({ currentWindow: true })
  items.sort((a, b) => (a.lastAccessed < b.lastAccessed) ? 1 : -1)
  return items
}

// Process tabs
App.process_tabs = function (tabs) {
  App.tab_items = []
  App.process_items(tabs, "tabs", App.tab_items)
}

// Open a new tab with a url
App.open_tab = function (item, close = true) {
  if (item.list === "tabs") {
    browser.tabs.update(item.tab_id, {active: true})
  } else {
    browser.tabs.create({url: item.url, active: true})
  }

  if (close) {
    window.close()
  }
}

// Close a tab
App.close_tab = function (item) {
  browser.tabs.remove(item.tab_id)
  App.remove_item(item)
}

// Setup tabs
App.setup_tabs = async function () {
  App.ev(App.el("#undo_button"), "click", function () {
    App.restore_tab()
  })

  App.ev(App.el("#new_button"), "click", function () {
    App.new_tab()
  })  

  browser.tabs.onUpdated.addListener(function (tab_id) {
    App.log("Tab updated")
    App.refresh_tab(tab_id)
  })
}

// Restore a closed tab
App.restore_tab = async function () {
  let closed = await browser.sessions.getRecentlyClosed()

  if (closed.length > 0) {
    let tab = closed[0].tab
    await browser.sessions.forgetClosedTab(tab.windowId, tab.sessionId)
    App.open_tab(tab, false)
  }
}

// Open a new tab
App.new_tab = function () {
  browser.tabs.create({active: true})
  window.close()
}

// Refresh tabs
App.refresh_tab = async function (tab_id) {
  let item = App.get_item_by_tab_id(tab_id)
  let info = await browser.tabs.get(tab_id)

  if (item) {
    App.update_tab(item, info)
  } else {
    App.prepend_tab(info)
  }
}

// Get tab by tab id
App.get_item_by_tab_id = function (tab_id) {
  for (let item of App.tab_items) {
    if (item.tab_id === tab_id) {
      return item
    }
  }
}

// Update a tab
App.update_tab = function (item, info) {
  for (let [i, it] of App.tab_items.entries()) {
    if (it.tab_id === item.tab_id) {
      let item = App.process_item(info, "tabs", [])
      App.tab_items[i].element.replaceWith(item.element)
      App.tab_items[i] = item
      App.create_item_element(item)
      App.show_item(item)
      break
    }
  }
}

// Prepend tab to the top
App.prepend_tab = function (tab) {
  let item = App.process_item(tab, "tabs", [])
  App.tab_items.unshift(item)
  App.el("#tabs").prepend(item.element)
  App.show_item(item)
}