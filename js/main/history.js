// Setup history
App.setup_history = function () {
  App.setup_item_window("history")

  let search_filter = App.create_debouncer(function () {
    App.search_history()
  }, App.filter_delay)

  App.ev(App.el("#history_search"), "input", function () {
    search_filter()
  })

  App.ev(App.el("#history_clear_search"), "click", function () {
    App.el("#history_search").value = ""
    App.search_history()
    App.focus_filter("history")
  })

  App.history_items = []
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.settings.history_max_months)
}

// Get items from history
App.get_history = async function (text = "") {
  let items = await browser.history.search({
    text: text,
    maxResults: App.settings.history_max_results,
    startTime: App.history_months()
  })

  return items
}

// History action
App.history_action = function (item) {
  App.focus_or_open_item(item)
}

// History action alt
App.history_action_alt = function (item) {
  App.focus_or_open_item(item, false)
}

// Search the history
App.search_history = async function () {
  let value = App.el("#history_search").value.trim()
  let items = await App.get_history(value)

  if (App.window_mode !== "history") {
    return
  }

  App.process_items("history", items)

  if (App.el("#history_filter").value.trim()) {
    App.do_item_filter("history")
  } else {
    App.select_first_item("history")
  }
}