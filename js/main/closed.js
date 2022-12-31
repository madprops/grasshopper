// Setup closed tabs
App.setup_closed = function () {
  App.setup_item_window("closed")

  browser.sessions.onChanged.addListener(function () {
    if (App.window_mode === "closed") {
      App.show_item_window("closed")
    }
  })
}

// Get closed tabs
App.get_closed = async function () {
  let ans = await browser.sessions.getRecentlyClosed({
    maxResults: App.max_closed
  })

  let items = ans.map(x => x.tab)
  return items
}

// Closed tabs action
App.closed_action = function (item) {
  App.item_action(item)
}

// Closed tabs action alt
App.closed_action_alt = function (item) {

}