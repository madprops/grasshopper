// Setup closed tabs
App.setup_closed_tabs = function () {
  App.create_window("closed_tabs")

  App.filter_closed_tabs = App.create_debouncer(function () {
    App.do_item_filter("closed_tabs")
  }, App.filter_delay)
  
  App.ev(App.el("#closed_tabs_filter"), "input", function () {
    App.filter_closed_tabs()
  })

  App.ev(App.el("#closed_tabs_filter_mode"), "change", function () {
    App.do_item_filter("closed_tabs")
  })

  App.ev(App.el("#closed_tabs_case_sensitive"), "change", function () {
    App.do_item_filter("closed_tabs")
  })    

  App.ev(App.el("#closed_tabs_next"), "click", function () {
    App.cycle_windows()
  })    
}

// Get closed tabs
App.get_closed_tabs = async function () {
  let items = await browser.sessions.getRecentlyClosed({
    maxResults: 25
  })

  return items
}

// Show closed tabs
App.show_closed_tabs = async function () {
  let items = await App.get_closed_tabs()
  let tabs = items.map(x => x.tab)
  App.process_items("closed_tabs", tabs)
  let v = App.el("#tabs_filter").value.trim()
  App.el("#closed_tabs_filter").value = v
  App.do_item_filter("closed_tabs")
  App.windows["closed_tabs"].show()
}

// Selected closed tab action
App.closed_tab_action = function () {
  App.restore_tab(App.selected_closed_tabs_item)
}