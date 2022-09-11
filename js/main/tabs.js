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
}

// Restore a closed tab
App.restore_tab = async function () {
  let closed = await browser.sessions.getRecentlyClosed()

  if (closed.length > 0) {
    let tab = closed[0].tab
    await browser.sessions.forgetClosedTab(tab.windowId, tab.sessionId)
    App.open_tab(tab, false)
    let tabs = await App.get_tabs()
    App.process_tabs(tabs)
    App.do_filter()
  }
}