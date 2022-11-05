// Setup closed tabs
App.setup_closed = function () {
  App.setup_item_window("closed")

  App.ev(App.el("#closed_forget_button"), "click", function () {
    App.forget_all_closed_tabs()
  })
}

// Get closed tabs
App.get_closed = async function () {
  let items = await browser.sessions.getRecentlyClosed({
    maxResults: 25
  })

  return items.map(x => x.tab)
}

// Selected closed tabs action
App.closed_action = function () {
  App.focus_or_open_item(App.selected_closed_item)
}

// Show information about closed tabs
App.show_closed_info = async function () {
  alert("These are recently closed tabs")
}

// Forget closed tab
App.forget_closed_tab = function (tab) {
  browser.sessions.forgetClosedTab(tab.window_id, tab.session_id)
  App.remove_item("closed", tab)
}

// Forget all closed tabs
App.forget_all_closed_tabs = function () {
  App.show_confirm("Forget Closed Tabs", 
  "Forget all the closed tabs", function () {
    for (let tab of App.closed_items.slice(0)) {
      App.forget_closed_tab(tab)
    }
  })
}