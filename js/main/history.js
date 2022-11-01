// Setup history
App.setup_history = function () {
  App.setup_item_window("history") 
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
}

// Get items from history
App.get_history = async function () {
  let results
  let r = App.state.history_results

  if (r === "fast") {
    results = 1000 * 2
  } else if (r === "normal") {
    results = 1000 * 10
  } else if (r === "deep") {
    results = 1000 * 20
  }

  let items = await browser.history.search({
    text: "",
    maxResults: results,
    startTime: App.history_months()
  })

  return items
}

// Open history item
App.open_history_item = function (item, close = true) {
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  }
}

// Selected history item action
App.history_action = function () {
  App.open_history_item(App.selected_history_item)
}

// Show history results info
App.show_history_results_info = function () {
  let s = ""
  s += "Fast = 2k results\n"
  s += "Normal = 10k results\n"
  s += "Deep = 20k results"
  alert(s)
}