// Empty history
App.empty_history = function () {
  for (let item of App.history_items) {
    item.element.remove()
  }

  App.history_fetched = false
}

// Get items from history
App.get_history = async function (show = true) {
  console.time("Get history")

  if (App.mode === "history") {
    App.selected_item = undefined
  }

  App.history_items = []
  App.history_fetched = true
  
  let items = await browser.history.search({
    text: "",
    maxResults: App.config.history_max_results,
    startTime: App.history_months()
  })

  App.process_items(App.history_items, items, "history")

  if (show) {
    App.show_history()
  } else {
    App.do_filter()
  }

  console.timeEnd("Get history")
}

// Show history
App.show_history = function () {
  App.mouse_over_disabled = true
  App.set_mode("history")
  App.do_filter("mode_change")
}

// Change to history
App.change_to_history = function () {
  App.log("Mode changed to history")
  
  if (!App.history_fetched) {
    App.get_history()
    return
  }

  App.show_history()
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.config.history_max_months)
}