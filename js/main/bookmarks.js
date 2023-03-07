// Setup bookmarks
App.setup_bookmarks = function () {
  App.setup_item_window("bookmarks")

  browser.bookmarks.onCreated.addListener(function (id, info) {
    if (App.window_mode === "bookmarks") {
      App.insert_item("bookmarks", info)
    }
  })

  browser.bookmarks.onRemoved.addListener(function (id, info) {
    if (App.window_mode === "bookmarks") {
      let item = App.get_item_by_id("bookmarks", id)

      if (item) {
        App.remove_item(item)
      }
    }
  })

  browser.bookmarks.onChanged.addListener(function (id, info) {
    if (App.window_mode === "bookmarks") {
      App.insert_item("bookmarks", info)
    }
  })
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
  App.item_action(item)
}

// Boomarks action alt
App.bookmarks_action_alt = function (item) {
  App.item_action(item, false)
}