// Setup closed tabs
App.setup_closed = function () {
  App.closed_filter_modes = [
    ["all", "All"],
    ["today", "Today"],
  ]

  let actions = [
    {text: "Top", action: function () {
      App.goto_top("closed")
    }}, 

    {text: "Pick All", action: function () {
      App.highlight_items("closed")
    }}, 
  ]

  App.setup_item_window("closed", actions)
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
  App.launch_item(item, false)
}