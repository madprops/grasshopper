// Empty history
App.empty_history = function () {
  for (let item of App.history_items) {
    item.element.remove()
  }

  App.history_fetched = false
}

// Get items from history
App.get_history = function () {
  console.time("Get history")

  if (App.mode === "history") {
    App.selected_item = undefined
  }

  App.history_items = []
  App.history_fetched = true
  browser.history.search({
    text: "",
    maxResults: App.config.history_max_results,
    startTime: Date.now() - (1000 * 60 * 60 * 24 * 30 * App.config.history_months)
  }).then(function (items) {
    App.process_items(App.history_items, items, "history")
    App.show_history()
    console.timeEnd("Get history")
  })
}

// Show history
App.show_history = function () {
  App.set_mode("history")
  App.do_filter()
}

// Change to history
App.change_to_history = function () {
  if (!App.history_fetched) {
    App.get_history()
    return
  }

  App.show_history()
}