App.setup_bookmarks = () => {
  App.bookmarks_actions = [
    {text: `Bookmark`, action: () => {
      App.bookmark_active()
    }},
    {text: `Media`, get_items: () => {
      return App.search_media(`bookmarks`)
    }},
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

App.get_bookmarks = async (query = ``) => {
  App.log(`Getting bookmarks`)
  let results = []

  try {
    results = await browser.bookmarks.search({query: query})
  }
  catch (err) {
    App.log(err, `error`)
    return []
  }

  results = results.filter(x => x.type === `bookmark`)

  results.sort((a, b) => {
    return a.dateAdded > b.dateAdded ? -1 : 1
  })

  App.last_bookmarks_query = query
  return results.slice(0, App.max_items)
}

App.bookmarks_action = (item) => {
  App.focus_or_open_item(item)
}

App.bookmarks_action_alt = (item) => {
  App.open_items(item, true)
}

App.bookmark_items = async (item, active) => {
  if (!active) {
    active = App.get_active_items(item.mode, item)
  }

  let bookmarks = await App.get_bookmarks()
  let urls = bookmarks.map(x => App.format_url(x.url || ``))
  let items = []

  for (let item of active) {
    let ok = true

    for (let url of urls) {
      if (item.url === url) {
        ok = false
        break
      }
    }

    if (ok) {
      items.push(item)
    }
  }

  if (items.length === 0) {
    return
  }

  let force = (items.length === 1) || !App.get_setting(`warn_on_bookmark`)

  App.show_confirm(`Bookmark these items? (${items.length})`, async () => {
    let results = await browser.bookmarks.search({title: App.bookmarks_folder})
    let folder

    for (let res of results) {
      if (res.title === App.bookmarks_folder && res.type === `folder`) {
        folder = res
        break
      }
    }

    if (!folder) {
      folder = await browser.bookmarks.create({title: App.bookmarks_folder})
    }

    for (let item of items) {
      await browser.bookmarks.create({parentId: folder.id, title: item.title, url: item.url})
    }

    App.beep()
  }, undefined, force)
}

App.bookmark_active = async () => {
  let tab = await App.get_active_tab()

  let item = {
    title: tab.title,
    url: App.format_url(tab.url || ``),
  }

  App.bookmark_items(undefined, [item])
}