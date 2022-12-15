// Setup history
App.setup_history = function () {
  App.history_sort_title = "Normal: Sorted by last visit\nSpecial: Most visited items on top"
  App.setup_item_window("history")
}

// Get history date
App.history_time = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
}

// Get items from history
App.get_history = async function (text = "") {
  let items = await browser.history.search({
    text: text,
    maxResults: App.history_max_results,
    startTime: App.history_time()
  })

  if (App.sort_state.items.history === "Special") {
    items.sort((a, b) => (a.visitCount < b.visitCount) ? 1 : -1)
  }

  return items
}

// History action
App.history_action = function (item) {
  if (App.check_media(item)) {
    return
  }
  
  let active = App.get_active_items("history")

  if (active.length === 1) {
    App.focus_or_open_item(active[0])
  } else if (active.length > 1) {
    App.launch_items("history")
  }
}

// History action alt
App.history_action_alt = function (item) {
  App.launch_item(item, false)
}

// Search the history
App.search_history = async function () {
  let value = App.el("#history_filter").value.trim()
  let items = await App.get_history(value)

  if (App.window_mode !== "history") {
    return
  }

  App.process_items("history", items)
}