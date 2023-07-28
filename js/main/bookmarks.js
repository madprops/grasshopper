App.setup_bookmarks = () => {
  App.bookmarks_actions = [
    {text: `BMark`, action: () => {
      App.bookmark_active()
    }},
    {text: `Media`, get_items: () => {
      return App.search_media(`bookmarks`)
    }},
  ]

  browser.bookmarks.onCreated.addListener((id, info) => {
    App.log(`Bookmark Created: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      App.insert_item(`bookmarks`, info)
    }
  })

  browser.bookmarks.onRemoved.addListener((id, info) => {
    App.log(`Bookmark Removed: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.remove_item(item)
      }
    }
  })

  browser.bookmarks.onChanged.addListener((id, info) => {
    App.log(`Bookmark Changed: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.update_item(`bookmarks`, item.id, info)
      }
    }
  })

  App.setup_item_window(`bookmarks`)
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
  let folder = await App.get_bookmarks_folder()
  let b1 = results.filter(x => x.parentId === folder.id)
  let b2 = results.filter(x => x.parentId !== folder.id)
  b1.sort((a, b) => b.index - a.index)
  b2.sort((a, b) => b.index - a.index)
  let bookmarks = [...b1, ...b2]
  App.last_bookmarks_query = query
  return bookmarks.slice(0, App.max_items)
}

App.bookmarks_action = (item) => {
  App.bookmark_items(undefined, [item], false)
  App.focus_or_open_item(item)
}

App.bookmarks_action_alt = (item) => {
  App.open_items(item, true)
}

App.get_bookmarks_folder = async () => {
  let bookmarks_folder = App.get_setting(`bookmarks_folder`)
  let results = await browser.bookmarks.search({title: bookmarks_folder})
  let folder

  for (let res of results) {
    if (res.title === bookmarks_folder && res.type === `folder`) {
      folder = res
      break
    }
  }

  if (!folder) {
    folder = await browser.bookmarks.create({title: bookmarks_folder})
  }

  return folder
}

App.bookmark_items = async (item, active, feedback = true) => {
  if (!active) {
    active = App.get_active_items(item.mode, item)
  }

  let folder = await App.get_bookmarks_folder()
  let bookmarks = await browser.bookmarks.getChildren(folder.id)

  for (let b of bookmarks) {
    b.url = App.format_url(b.url || ``)
  }

  let add = []
  let bump = []

  for (let item of active) {
    let bumped = false

    for (let b of bookmarks) {
      if (item.url === b.url) {
        bump.push(b.id)
        bumped = true
        break
      }
    }

    if (!bumped) {
      let ok = true

      for (let a of add) {
        if (a.url === item.url) {
          ok = false
          break
        }
      }

      if (ok) {
        add.push(item)
      }
    }
  }

  if (add.length === 0 && bump.length === 0) {
    return
  }

  let num = add.length + bump.length

  if (num === 0) {
    return
  }

  let force = (num === 1) || !App.get_setting(`warn_on_bookmark`)

  if (num >= App.max_warn_limit) {
    force = false
  }

  App.show_confirm(`Bookmark these items? (${num})`, async () => {
    for (let item of add) {
      await browser.bookmarks.create({parentId: folder.id, title: item.title, url: item.url})
    }

    for (let id of bump) {
      await browser.bookmarks.move(id, {index: bookmarks.length - 1})
    }

    if (bump.length > 0) {
      App.show_mode(`bookmarks`)
    }

    if (feedback) {
      App.show_feedback(`Bookmarked`)
    }
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