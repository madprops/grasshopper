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
  let r = App.settings.history_results

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

// History action
App.history_action = function (item) {
  App.focus_or_open_item(item)
}

// History action alt
App.history_action_alt = function (item) {
  App.focus_or_open_item(item, false)
}

// Show history results info
App.show_history_results_info = function () {
  let s = ""
  s += "Fast = 2k results\n"
  s += "Normal = 10k results\n"
  s += "Deep = 20k results"
  alert(s)
}

// Forget history item
App.forget_history_item = function (item) {
  for (let it of App.history_items_original) {
    if (it && App.format_url(it.url) === item.url) {
      browser.history.deleteUrl({url: it.url})
    }
  }
  
  App.remove_item("history", item)
}