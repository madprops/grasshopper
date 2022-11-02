// Setup closed tabs
App.setup_closed = function () {
  App.setup_item_window("closed")
}

// Get closed tabs
App.get_closed = async function () {
  let items = await browser.sessions.getRecentlyClosed({
    maxResults: 25
  })

  return items.map(x => x.tab)
}

// Selected closed tabs action
App.closed_action = function () {
  App.restore_tab(App.selected_closed_item)
}