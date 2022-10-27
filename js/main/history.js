// Setup history
App.setup_history = function () {
  App.create_window("history") 

  App.ev(App.el("#history_button"), "click", function () {  
    App.show_history()
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
}

// Get items from history
App.get_history = async function () {
  let items = await browser.history.search({
    text: "",
    maxResults: App.history_max_items,
    startTime: App.history_months()
  })

  return items
}

// Get history months date
App.history_months = function () {
  return Date.now() - (1000 * 60 * 60 * 24 * 30 * App.history_max_months)
}

// Show history
App.show_history = async function () {
  let items = await App.get_history()
  App.process_items("history", items)
  let v = App.el("#tabs_filter").value.trim()
  App.el("#history_filter").value = v
  App.do_item_filter("history")
  App.windows["history"].show()
}

// Open history item
App.open_history_item = function (item, close = true) {
  browser.tabs.create({url: item.url, active: close})

  if (close) {
    window.close()
  }
}

// Selected history item action
App.history_item_action = function () {
  App.open_history_item(App.selected_history_item)
}