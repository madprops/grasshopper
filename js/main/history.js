// Setup history
App.setup_history = function () {
  let actions = [
    {text: "Top", action: function () {
      App.goto_top("history")
    }}, 

    {conditional: function () {
      if (App.history_mode === "normal") {
        return {text: "Today", action: function () {
          App.show_today_history()
        }}
      } else {
        return {text: "Normal", action: function () {
          App.show_normal_history()
        }}
      }
    }},     

    {text: "Pick All", action: function () {
      App.highlight_items("history")
    }}, 
  ]

  App.setup_item_window("history", actions)
}

// Get history date
App.history_time = function () {
  if (App.history_mode === "normal") {
    return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
  } else if (App.history_mode === "today") {
    return Date.now() - (1000 * 60 * 60 * 24)
  }
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
  App.focus_or_open_item(item)
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

// Show normal history
App.show_normal_history = function () {
  App.history_mode = "normal"
  App.show_item_window("history")
}

// Show today's history
App.show_today_history = function () {
  App.history_mode = "today"
  App.show_item_window("history")
}