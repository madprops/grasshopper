// Setup closed tabs
App.setup_closed = function () {
  App.setup_item_window("closed")
}

// Get closed tabs
App.get_closed = async function () {
  let ans = await browser.sessions.getRecentlyClosed({
    maxResults: App.max_closed
  })

  let items = ans.map(x => x.tab)

  if (App.closed_sort === "Normal") {
    //
  } 
  
  else if (App.closed_sort === "ABC") {
    App.sort_items_by_abc(items)
  }

  return items
}

// Closed tabs action
App.closed_action = function (item) {
  if (App.check_media(item)) {
    return
  }
  
  App.focus_or_open_item(item)
}

// Closed tabs action alt
App.closed_action_alt = function (item) {
  App.launch_item(item, false)
}