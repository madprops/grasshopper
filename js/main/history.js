// Setup history
App.setup_history = function () {
  App.setup_item_window("history") 
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
  if (App.history_items) {
    let n = App.history_items.length
    let s = App.plural(n, "history result", "history results")
    alert(s)
  } else {
    alert("Search the history")
  }
}

// Search the history
App.search_history = async function () {
  let value = App.el("#history_filter").value.trim()

  if (!value) {
    return
  }
  
  let items = await App.get_history(value)
  App.process_items("history", items)
}