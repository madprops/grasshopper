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
        App.update_item({mode: `bookmarks`, id: item.id, info})
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
      folder,
      title: query,
      deep,
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

App.get_bookmarks_folder = async (item) => {
  let title

  if (item) {
    let match = App.check_bookmark_rules(item)

    if (match) {
      title = match
    }
  }

  if (!title) {
    title = App.get_setting(`bookmarks_folder`)
  }

  if (!title) {
    title = App.get_default_setting(`bookmarks_folder`)
  }

  if (!title) {
    title = `Bookmarks`
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
    App.bookmark_items_to_folder(args)
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

  let items = []

  for (let item of args.active) {
    if (item.header) {
      continue
    }

    let exists = items.some(it => it.url === item.url)

    if (!exists) {
      items.push(item)
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
        let folder

        if (!args.folder) {
          folder = await App.get_bookmarks_folder(item)
        }

        if (!folder) {
          continue
        }

        await browser.bookmarks.create({parentId: folder.id, title, url: item.url})
      }

      let feedback = App.get_setting(`show_feedback`)

      if (feedback) {
        App.alert_autohide(`Bookmarked`)
      }
    },
    force,
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

App.bookmark_items_to_folder = async (args) => {
  let folders = await App.get_bookmark_folders()

  if (!folders.length) {
    return
  }

  function callback(folder) {
    args.folder = folder
    App.bookmark_items(args)
  }

  App.do_select_bookmarks_folder({folders, callback, include_all: false, e: args.e})
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

App.clean_bookmark_nodes = (nodes) => {
  return nodes.filter(x => x.type === `bookmark`)
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
  let clean = true
  let max

  if (args.folder) {
    let children = items.filter(x => x.parentId === args.folder.id)

    if (args.deep) {
      items = App.get_bookmark_subitems(args.folder.id, items)
      clean = false
    }
    else {
      items = children
    }
  }

  if (clean) {
    items = App.clean_bookmark_nodes(items)
  }

  if (args.deep) {
    max = App.get_setting(`deep_max_search_items_bookmarks`)
  }
  else {
    max = App.get_setting(`max_search_items_bookmarks`)
  }

  if (args.title.trim()) {
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

App.pick_bookmarks_folder = async (e) => {
  let perm = await App.ask_permission(`bookmarks`)

  if (!perm) {
    return
  }

  let folders = await App.get_bookmark_folders()

  if (!folders.length) {
    return
  }

  App.do_select_bookmarks_folder({folders, e})
}

App.do_select_bookmarks_folder = (args = {}) => {
  let def_args = {
    include_all: true,
  }

  App.def_args(def_args, args)
  let items = []

  if (args.include_all) {
    items.push({
      text: `All`,
      action: async () => {
        App.bookmarks_folder = undefined
        App.show_mode({mode: `bookmarks`, force: true})
      },
    })
  }

  for (let folder of args.folders) {
    items.push({
      text: folder.title,
      action: async () => {
        if (args.callback) {
          args.callback(folder)
        }
        else {
          App.bookmarks_folder = folder
          App.show_mode({mode: `bookmarks`, force: true})
        }
      },
    })
  }

  if (!items.length) {
    if (args.callback) {
      args.callback()
    }

    return
  }

  App.show_context({items, title: `Pick Folder`, e: args.e})
}

App.search_bookmarks_folder = async (callback) => {
  let perm = await App.ask_permission(`bookmarks`)

  if (!perm) {
    return
  }

  App.show_prompt({
    placeholder: `Search Folder`,
    on_submit: async (title) => {
      let folders = await App.get_bookmark_folders(title)
      App.do_select_bookmarks_folder({folders, callback, include_all: true})
    }
  })
}

App.request_bookmarks = () => {
  browser.runtime.sendMessage({action: `refresh_bookmarks`})
}

App.make_bookmarks_folder = async (title, parent = ``) => {
  if (parent) {
    return await browser.bookmarks.create({title, parentId: parent.id})
  }
  else {
    return await browser.bookmarks.create({title})
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

      App.do_select_bookmarks_folder({folders, callback: (folder) => {
        action(title, folder)
      }, include_all: false})
    }
  })
}

App.init_bookmarks = async () => {
  if (App.bookmarks_received) {
    return
  }

  await browser.runtime.sendMessage({action: `send_bookmarks`})
}

App.reset_bookmarks = () => {
  App.bookmarks_folder = undefined
}

App.set_bookmarks_title = () => {
  let btn = DOM.el(`#bookmarks_main_menu`)
  let name

  if (App.bookmarks_folder) {
    name = App.bookmarks_folder.title
  }
  else {
    name = ``
  }

  App.set_main_menu_text(btn, `bookmarks`, name)
}

App.get_bookmark_subitems = (parent, children, bookmarks = []) => {
  for (let child of children) {
    if (child.parentId === parent) {
      if (child.type === `folder`) {
        App.get_bookmark_subitems(child.id, children, bookmarks)
      }
      else if (child.type === `bookmark`) {
        bookmarks.push(child)
      }
    }
  }

  return bookmarks
}

App.check_bookmark_rules = (item) => {
  let rules = App.get_setting(`bookmark_rules`)

  if (!rules.length) {
    return
  }

  let title = App.title(item)
  let url = item.url

  function check(rule) {
    let mode = rule.mode
    let split = mode.split(`_`)
    let mstr = split.slice(0, -1).join(`_`)
    let rvalue = rule.value.toLowerCase()
    let what = split.at(-1)
    let match = false
    let value

    if (what === `url`) {
      value = url
      rvalue = App.fix_url(rvalue)
    }
    else if (what === `title`) {
      value = title
    }

    value = value.toLowerCase()

    if (mstr === `starts_with`) {
      if (value.startsWith(rvalue)) {
        match = true
      }
    }
    else if (mstr === `ends_with`) {
      if (value.endsWith(rvalue)) {
        match = true
      }
    }
    else if (mstr === `includes`) {
      if (value.includes(rvalue)) {
        match = true
      }
    }
    else if (mstr === `regex`) {
      let regex = new RegExp(rvalue)

      if (regex.test(value)) {
        match = true
      }
    }

    return match
  }

  for (let rule of rules) {
    if (check(rule)) {
      return rule.folder
    }
  }
}