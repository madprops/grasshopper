// Setup closed tabs
App.setup_closed = function () {
  App.setup_item_window("closed")
}

// Get closed tabs
App.get_closed = async function () {
  let items = await browser.sessions.getRecentlyClosed({
    maxResults: App.max_closed
  })

  return items.map(x => x.tab)
}

// Closed tabs action
App.closed_action = function (item) {
  App.focus_or_open_item(item)
}

// Closed tabs action alt
App.closed_action_alt = function (item) {
  App.focus_or_open_item(item, false)
}

// Show information about closed tabs
App.show_closed_info = function () {
  alert(`These are recently closed tabs. Max is ${App.max_closed} items`)
}