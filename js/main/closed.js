// Setup closed tabs
App.setup_closed = () => {
  App.setup_item_window(`closed`)

  browser.sessions.onChanged.addListener(() => {
    if (App.window_mode === `closed`) {
      App.show_item_window(`closed`)
    }
  })
}

// Get closed tabs
App.get_closed = async () => {
  let ans = await browser.sessions.getRecentlyClosed({
    maxResults: App.max_closed
  })

  let items = ans.map(x => x.tab)
  return items
}

// Closed tabs action
App.closed_action = (item) => {
  App.item_action(item)
}

// Closed tabs action alt
App.closed_action_alt = (item) => {
  App.item_action(item, false)
}