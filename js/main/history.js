// Setup history
App.setup_history = function () {
  App.setup_item_window("history")

  browser.history.onVisited.addListener(function (info) {
    if (App.window_mode === "history") {
      App.insert_item("history", info)
    }
  })
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

  return items
}

// History action
App.history_action = function (item) {
  App.item_action(item)
}

// History action alt
App.history_action_alt = function (item) {

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