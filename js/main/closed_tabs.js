// Setup closed tabs
App.setup_closed_tabs = function () {
  App.create_window("closed_tabs")

  App.ev(App.el("#closed_button"), "click", function () {
    App.show_window("closed_tabs")
  })  

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
  
  App.ev(App.el("#closed_tabs_prev"), "click", function () {
    App.cycle_windows(true)
  })   
}

// Get closed tabs
App.get_closed_tabs = async function () {
  let items = await browser.sessions.getRecentlyClosed({
    maxResults: 25
  })

  return items.map(x => x.tab)
}

// Selected closed tabs action
App.closed_tabs_action = function () {
  App.restore_tab(App.selected_closed_tabs_item)
}

// Action alt
App.closed_tabs_action_alt = function () {
  App.restore_tab(App.selected_closed_tabs_item, false)
  App.remove_item("closed_tabs", App.selected_closed_tabs_item)   
}