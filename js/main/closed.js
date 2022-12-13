// Setup closed tabs
App.setup_closed = function () {
  App.closed_sort_title = "Special: Sorted by hostname"
  App.setup_item_window("closed")
}

// Get closed tabs
App.get_closed = async function () {
  let ans = await browser.sessions.getRecentlyClosed({
    maxResults: App.max_closed
  })

  let items = ans.map(x => x.tab)

  if (App.closed_sort === "Special") {
    items.sort(function (a, b) {
      let h1 = App.get_hostname(a.url)
      let h2 = App.get_hostname(b.url)
      return h1 < h2
    })
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