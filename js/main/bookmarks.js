// Setup bookmarks
App.setup_bookmarks = () => {
  App.setup_item_window("bookmarks")

  browser.bookmarks.onCreated.addListener((id, info) => {
    if (App.window_mode === "bookmarks") {
      App.insert_item("bookmarks", info)
    }
  })

  browser.bookmarks.onRemoved.addListener((id, info) => {
    if (App.window_mode === "bookmarks") {
      let item = App.get_item_by_id("bookmarks", id)

      if (item) {
        App.remove_item(item)
      }
    }
  })

  browser.bookmarks.onChanged.addListener((id, info) => {
    if (App.window_mode === "bookmarks") {
      App.insert_item("bookmarks", info)
    }
  })
}

// Get bookmarks
App.get_bookmarks = async () => {
  let bookmarks = await browser.bookmarks.search({})

  bookmarks.sort((a, b) => {
    return a.dateAdded > b.dateAdded ? -1 : 1
  })

  return bookmarks
}

// Boomarks action
App.bookmarks_action = (item) => {
  App.item_action(item)
}

// Boomarks action alt
App.bookmarks_action_alt = (item) => {
  App.item_action(item, false)
}