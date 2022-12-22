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

// Boomarks action
App.bookmarks_action = function (item) {
  if (App.check_media(item)) {
    return
  }

  App.focus_or_open_item(item)
}

// Boomarks action alt
App.bookmarks_action_alt = function (item) {
  App.launch_item(item, false)
}