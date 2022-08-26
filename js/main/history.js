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
  App.set_mode("history")
  App.clear_filter()
  App.do_filter()
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

// Get a an item from history
App.get_history_item = async function (url) {
  if (App.history_items.length > 0) {
    for (let item of App.history_items) {
      if (item.url === url) {
        return item
      }
    }
  } else {
    let items = await browser.history.search({
      text: url,
      maxResults: 1,
      startTime: App.history_months()
    })

    if (items.length > 0) {
      return items[0]
    }
  }
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.config.history_max_months)
}