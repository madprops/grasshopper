// Setup closed tabs
App.setup_closed_tabs = function () {
  App.setup_window("closed_tabs")
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