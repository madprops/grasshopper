// Setup history
App.setup_history = function () {
  App.create_window("history") 

  App.ev(App.el("#history_button"), "click", function () {  
    App.show_window("history")
  })

  App.filter_history = App.create_debouncer(function () {
    App.do_item_filter("history")
  }, App.filter_delay)
  
  App.ev(App.el("#history_filter"), "input", function () {
    App.filter_history()
  })  

  App.ev(App.el("#history_filter_mode"), "change", function () {
    App.do_item_filter("history")
  })

  App.ev(App.el("#history_case_sensitive"), "change", function () {
    App.do_item_filter("history")
  })
  
  App.ev(App.el("#history_next"), "click", function () {
    App.cycle_windows()
  }) 
  
  App.ev(App.el("#history_prev"), "click", function () {
    App.cycle_windows(true)
  })  
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
    results = 1000 * 1
  } else if (r === "normal") {
    results = 1000 * 5
  } else if (r === "deep") {
    results = 1000 * 10
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

// Action alt
App.history_action_alt = function () {
  App.open_history_item(App.selected_history_item, false)
  App.remove_item("history", App.selected_history_item)  
}

// Show history results info
App.show_history_results_info = function () {
  let s = ""
  s += "Fast = 1k results\n"
  s += "Normal = 5k results\n"
  s += "Deep = 10k results"
  alert(s)
}