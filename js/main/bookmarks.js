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

  if (query) {
    if (App.get_setting(`auto_deep_search_bookmarks`)) {
      deep = true
    }
  }

  let folder

  if (App.bookmarks_folder) {
    folder = App.bookmarks_folder
  }
  else if (App.get_setting(`all_bookmarks`)) {
    folder = ``
  }
  else {
    folder = await App.get_bookmarks_folder()
  }

  try {
    results = await App.get_bookmark_items({
      folder: folder,
      title: query,
      deep: deep,
    })
  }
  catch (err) {
    App.error(err)
    return []
  }

  App.last_bookmarks_query = query
  return results
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

  let folders = App.bookmark_folders_cache
  let folder

  for (let f of folders) {
    if (f.title === title) {
      folder = f
      break
    }
  }

  if (!folder) {
    folder = await App.make_bookmarks_folder(title)
  }

  return folder
}

App.bookmark_items = async (args = {}) => {
  let def_args = {
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

  if (args.search_folder && !args.folder) {
    App.search_bookmarks_folder((folder) => {
      if (folder) {
        args.folder = folder
        App.bookmark_items(args)
      }
    })

    return
  }

  if (!args.folder) {
    args.folder = await App.get_bookmarks_folder()
  }

  let items = []

  for (let item of args.active) {
    if (item.header) {
      continue
    }

    let exists = items.some(it => it.url === item.url)

    if (!exists) {
      items.push(item);
    }
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_bookmark`, items)

  App.show_confirm({
    message: `Bookmark items? (${items.length})`,
    confirm_action: async () => {
      for (let item of items) {
        let title = App.title(item)
        await browser.bookmarks.create({parentId: args.folder.id, title: title, url: item.url})
      }

      let feedback = App.get_setting(`show_feedback`)

      if (feedback) {
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

  if (!folders.length) {
    return
  }

  function action(folder) {
    args.folder = folder
    App.bookmark_items(args)
  }

  App.do_select_bookmarks_folder(folders, action, false)
}

App.filter_bookmark_nodes = (title, nodes, max) => {
  let items = []
  title = title.toLowerCase()

  for (let node of nodes) {
    if (node.title.toLowerCase().includes(title)) {
      items.push(node)
    }

    if (items.length >= max) {
      break
    }
  }

  return items
}

App.get_bookmark_items = async (args = {}) => {
  let def_args = {
    folder: ``,
    title: ``,
    deep: false,
  }

  App.def_args(def_args, args)
  await App.init_bookmarks()
  let items = App.bookmark_items_cache
  let max

  if (args.deep) {
    max = App.get_setting(`deep_max_search_items_bookmarks`)
  }
  else {
    max = App.get_setting(`max_search_items_bookmarks`)
  }

  if (args.folder) {
    items = items.filter(x => x.parentId === args.folder.id)
  }

  if (args.title) {
    items = App.filter_bookmark_nodes(args.title, items, max)
  }
  else {
    items = items.slice(0, max)
  }

  return items
}

App.get_bookmark_folders = async (title = ``) => {
  await App.init_bookmarks()
  let items = App.bookmark_folders_cache
  let max = App.get_setting(`max_bookmark_folders`)

  if (title) {
    items = App.filter_bookmark_nodes(title, items, max)
  }
  else {
    items = items.slice(0, max)
  }

  return items
}

App.select_bookmarks_folder = async () => {
  let perm = await App.ask_permission(`bookmarks`)

  if (!perm) {
    return
  }

  let folders = await App.get_bookmark_folders()

  if (!folders.length) {
    return
  }

  App.do_select_bookmarks_folder(folders)
}

App.do_select_bookmarks_folder = (folders, callback, include_all = true) => {
  let items = []

  if (include_all) {
    items.push({
      text: `All`,
      action: async () => {
        App.bookmarks_folder = undefined
        App.show_mode({mode: `bookmarks`, force: true})
      },
    })
  }

  for (let folder of folders) {
    items.push({
      text: folder.title,
      action: async () => {
        if (callback) {
          callback(folder)
        }
        else {
          App.bookmarks_folder = folder
          App.show_mode({mode: `bookmarks`, force: true})
        }
      },
    })
  }

  if (!items.length) {
    if (callback) {
      callback()
    }

    return
  }

  App.show_context({items: items, title: `Select Folder`})
}

App.search_bookmarks_folder = async (callback) => {
  let perm = await App.ask_permission(`bookmarks`)

  if (!perm) {
    return
  }

  App.show_prompt({
    placeholder: `Search Folder`,
    on_submit: (title) => {
      App.do_search_bookmarks_folder(title, callback)
    }
  })
}

App.do_search_bookmarks_folder = async (title, callback) => {
  let folders = await App.get_bookmark_folders(title)
  App.do_select_bookmarks_folder(folders, callback, false)
}

App.request_bookmarks = () => {
  browser.runtime.sendMessage({action: `refresh_bookmarks`})
}

App.make_bookmarks_folder = async (title, parent = ``) => {
  if (parent) {
    return await browser.bookmarks.create({title: title, parentId: parent.id})
  }
  else {
    return await browser.bookmarks.create({title: title})
  }
}

App.create_bookmarks_folder = () => {
  function action(title, parent = ``) {
    if (App.make_bookmarks_folder(title, parent)) {
      let feedback = App.get_setting(`show_feedback`)

      if (feedback) {
        App.alert_autohide(`Folder Created`)
      }
    }
  }

  App.show_prompt({
    placeholder: `Folder Name`,
    on_submit: async (title) => {
      if (!title) {
        return
      }

      if (App.get_setting(`direct_bookmarks_folder`)) {
        action(title)
        return
      }

      let folders = await App.get_bookmark_folders()

      if (!folders.length) {
        action(title)
        return
      }

      App.do_select_bookmarks_folder(folders, (folder) => {
        action(title, folder)
      }, false)
    }
  })
}

App.init_bookmarks = async () => {
  if (App.bookmarks_received) {
    return
  }

  await browser.runtime.sendMessage({action: `send_bookmarks`})
}