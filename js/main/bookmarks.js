// Setup bookmarks
App.setup_bookmarks = function () {
  App.setup_item_window("bookmarks")
}

// Get bookmarks
App.get_bookmarks = async function () {
  let bookmarks = await browser.bookmarks.search({})

  bookmarks.sort(function (a, b) {
    return a.dateAdded > b.dateAdded ? -1 : 1
  })

  return bookmarks
}

// Stars action
App.bookmarks_action = function (item) {
  if (App.check_media(item)) {
    return
  }

  let active = App.get_active_items("bookmarks")

  if (active.length === 1) {
    App.focus_or_open_item(active[0])
  }

  else if (active.length > 1) {
    App.launch_items("bookmarks")
  }
}

// Stars action alt
App.bookmarks_action_alt = function (item) {
  App.launch_item(item, false)
}