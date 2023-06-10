App.setup_bookmarks = () => {
  App.bookmarks_filter_modes = [
    [`--separator--`],
    [`star`, `Has Star`],
  ]

  App.setup_item_window(`bookmarks`)

  browser.bookmarks.onCreated.addListener((id, info) => {
    if (App.window_mode === `bookmarks`) {
      App.insert_item(`bookmarks`, info)
    }
  })

  browser.bookmarks.onRemoved.addListener((id, info) => {
    if (App.window_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.remove_item(item)
      }
    }
  })

  browser.bookmarks.onChanged.addListener((id, info) => {
    if (App.window_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.update_item(`bookmarks`, item.id, info)
      }
    }
  })
}

App.get_bookmarks = async () => {
  App.log(`Getting bookmarks`)
  let bookmarks

  try {
    bookmarks = await browser.bookmarks.search({})
  }
  catch (err) {
    App.log(err, `error`)
    return []
  }

  bookmarks.sort((a, b) => {
    return a.dateAdded > b.dateAdded ? -1 : 1
  })

  return bookmarks
}

App.bookmarks_action = (item) => {
  App.item_action(item)
}

App.bookmarks_action_alt = (item) => {
  App.launch_items(item)
}