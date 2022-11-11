// Setup history
App.setup_history = function () {
  App.setup_item_window("history")

  let search_filter = App.create_debouncer(function () {
    App.search_history()
  }, App.filter_delay)

  App.ev(App.el("#history_search"), "input", function () {
    search_filter()
  })

  App.history_items = []
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
}

// Get items from history
App.get_history = async function (text) {
  let items = await browser.history.search({
    text: text,
    maxResults: App.history_max_results,
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

// Show information about history
App.show_history_info = function () {
  let num = App.els(".history_item").length

  if (num > 0) {
    alert(App.plural(num, "history result", "history results"))
  } else {
    alert("Search the history")
  }
}

// Search the history
App.search_history = async function () {
  let value = App.el("#history_search").value.trim()

  if (!value) {
    App.el("#history_container").innerHTML = ""
    return
  }
  
  let items = await App.get_history(value)

  if (App.window_mode !== "history") {
    return
  }

  App.process_items("history", items)
  App.select_first_item("history")
}

// Show history window
App.show_history = function (cycle = false) {
  let last_mode = App.window_mode

  if (!App.window_order.includes(last_mode)) {
    last_mode = "tabs"
  }

  let search = App.el("#history_search")
  let filter = App.el("#history_filter")

  App.el("#history_container").innerHTML = ""
  search.value = App.get_last_window_value(cycle)
  App.windows["history"].show()
  App.el("#history_select").value = "history"
  App.empty_footer("history")
  filter.value = ""
  search.focus()
  App.search_history()
}