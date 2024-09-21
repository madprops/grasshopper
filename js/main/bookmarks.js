App.setup_bookmarks = () => {
  if (App.setup_bookmarks_ready) {
    return
  }

  browser.bookmarks.onCreated.addListener((id, info) => {
    App.debug(`Bookmark Created: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      App.insert_item(`bookmarks`, info)
    }
  })

  browser.bookmarks.onRemoved.addListener((id, info) => {
    App.debug(`Bookmark Removed: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.remove_item(item)
      }
    }
  })

  browser.bookmarks.onChanged.addListener((id, info) => {
    App.debug(`Bookmark Changed: ID: ${id}`)

    if (App.active_mode === `bookmarks`) {
      let item = App.get_item_by_id(`bookmarks`, id)

      if (item) {
        App.update_item({mode: `bookmarks`, id: item.id, info: info})
      }
    }
  })

  App.setup_bookmarks_ready = true
}

App.get_bookmarks = async (query = ``, deep = false) => {
  App.getting(`bookmarks`)
  let results = []

  try {
    results = await browser.bookmarks.search({query: query})
  }
  catch (err) {
    App.error(err)
    return []
  }1

  let bookmarks = results.filter(x => x.type === `bookmark`)

  if (App.bookmarks_folder) {
    bookmarks = bookmarks.filter(x => x.parentId === App.bookmarks_folder.id)
  }
  else if (!App.get_setting(`all_bookmarks`)) {
    let folder = await App.get_bookmarks_folder()
    bookmarks = bookmarks.filter(x => x.parentId === folder.id)
  }

  bookmarks.sort((a, b) => b.dateAdded - a.dateAdded)
  App.last_bookmarks_query = query
  let max_items = App.get_setting(`max_search_items`)

  if (deep) {
    max_items = App.get_setting(`deep_max_search_items`)
  }

  return bookmarks.slice(0, max_items)
}

App.bookmarks_action = (args = {}) => {
  let def_args = {
    on_action: true,
  }

  App.def_args(def_args, args)
  App.select_item({item: args.item, scroll: `nearest_smooth`})

  if (args.on_action) {
    App.on_action(`bookmarks`)
  }

  App.focus_or_open_item(args.item)
}

App.get_bookmarks_folder = async (title) => {
  if (!title) {
    title = App.get_setting(`bookmarks_folder`)

    if (!title) {
      title = App.get_default_setting(`bookmarks_folder`)
    }
  }

  let results = await browser.bookmarks.search({title: title})
  let folder

  for (let res of results) {
    if ((res.title === title) && (res.type === `folder`)) {
      folder = res
      break
    }
  }

  if (!folder) {
    folder = await browser.bookmarks.create({title: title})
  }

  return folder
}

App.bookmark_items = async (args = {}) => {
  let def_args = {
    feedback: true,
    pick_folder: false,
  }

  App.def_args(def_args, args)
  let perm = await App.ask_permission(`bookmarks`)

  if (!perm) {
    return
  }

  if (!args.active) {
    args.active = App.get_active_items({mode: args.item.mode, item: args.item})
  }

  if (args.pick_folder && !args.folder) {
    App.pick_bookmarks_folder(args)
    return
  }

  if (!args.folder) {
    args.folder = await App.get_bookmarks_folder()
  }

  console.log(args.folder)

  let bookmarks = await browser.bookmarks.getChildren(args.folder.id)

  for (let b of bookmarks) {
    b.url = App.format_url(b.url || ``)
  }

  let add = []
  let bump = []

  for (let item of args.active) {
    if (item.header) {
      continue
    }

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

  if (!add.length && !bump.length) {
    return
  }

  let items = [...add, ...bump]

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_bookmark`, items)

  App.show_confirm({
    message: `Bookmark items? (${items.length})`,
    confirm_action: async () => {
      for (let item of add) {
        let title = App.title(item)
        await browser.bookmarks.create({parentId: args.folder.id, title: title, url: item.url})
      }

      for (let id of bump) {
        await browser.bookmarks.move(id, {index: bookmarks.length - 1})
      }

      if (args.feedback) {
        App.alert_autohide(`Bookmarked`)
      }
    },
    force: force,
  })
}

App.bookmark_active = async () => {
  let perm = await App.ask_permission(`bookmarks`)

  if (!perm) {
    return
  }

  let tab = await App.get_active_tab()

  let item = {
    title: tab.title,
    url: App.format_url(tab.url || ``),
  }

  App.bookmark_items({active: [item]})
}

App.pick_bookmarks_folder = async (args) => {
  let folders = await App.get_bookmark_folders()
  folders = folders.filter(x => x.title)
  let items = []

  for (let folder of folders) {
    items.push({
      text: folder.title,
      action: async () => {
        args.folder = folder
        App.bookmark_items(args)
      },
    })
  }

  App.show_context({items: items})
}

App.get_bookmark_folders = async () => {
  let folders = []
  let nodes = await browser.bookmarks.getTree()

  function traverse(bookmarks) {
    for (let bookmark of bookmarks) {
      if (bookmark.children) {
        folders.push(bookmark)
        traverse(bookmark.children)
      }
    }
  }

  traverse(nodes)
  return folders
}

App.select_bookmarks_folder = async () => {
  let folders = await App.get_bookmark_folders()
  folders = folders.filter(x => x.title)
  let items = []

  items.push({
    text: `All`,
    action: async () => {
      App.bookmarks_folder = undefined
      App.show_mode({mode: `bookmarks`, force: true})
    },
  })

  for (let folder of folders) {
    items.push({
      text: folder.title,
      action: async () => {
        App.bookmarks_folder = folder
        App.show_mode({mode: `bookmarks`, force: true})
      },
    })
  }

  App.show_context({items: items})
}