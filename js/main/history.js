// Get items from history
App.get_history = async function (show = true) {
  App.history = await browser.history.search({
    text: "",
    maxResults: App.config.history_max_results,
    startTime: App.history_months()
  })
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.config.history_max_months)
}

// Process histroy items
App.process_history = function () {
  App.items = []
  App.process_items(App.items, App.history)
}