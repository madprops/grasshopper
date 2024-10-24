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

App.get_bookmarks = async (query = ``, deep = false, by_what = `all`) => {
  App.getting(`bookmarks`)
  let results = []

  if (query && App.get_setting(`auto_deep_search_bookmarks`)) {
    deep = true
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
      query,
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
    soft: false,
  }

  App.def_args(def_args, args)

  if (App.is_folder(args.item)) {
    App.travel_to_bookmarks_folder(args.item)
    return
  }

  App.select_item({item: args.item, scroll: `nearest_smooth`})

  if (args.on_action) {
    App.on_action(`bookmarks`)
  }

  App.focus_or_open_item(args.item, args.soft)
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
        else {
          folder = args.folder
        }

        if (!folder) {
          continue
        }

        await browser.bookmarks.create({parentId: folder.id, title, url: item.url})
      }

      let feedback = App.get_setting(`show_feedback`)

      if (feedback) {
        App.footer_message(`Bookmarked`)
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

  App.do_select_bookmarks_folder({
    folders, callback,
    include_all: false,
    e: args.e,
    create: true,
  })
}

App.filter_bookmark_nodes = (query, nodes, max) => {
  let items = []
  query = query.toLowerCase()

  for (let node of nodes) {
    let match = false

    if (!match && node.title) {
      if (node.title.toLowerCase().includes(query)) {
        items.push(node)
        match = true
      }
    }

    if (!match && node.url) {
      if (node.url.toLowerCase().includes(query)) {
        items.push(node)
        match = true
      }
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
    query: ``,
    deep: false,
  }

  App.def_args(def_args, args)
  await App.init_bookmarks()
  let items = App.bookmark_items_cache
  let clean = true

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

  if (App.bookmark_folders_enabled()) {
    clean = false
  }

  if (clean) {
    items = App.clean_bookmark_nodes(items)
  }

  if (!args.query) {
    let max

    if (args.deep) {
      max = App.get_setting(`deep_max_search_items_bookmarks`)
    }
    else {
      max = App.get_setting(`max_search_items_bookmarks`)
    }

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

  if (args.create) {
    items.push({
      text: `Create`,
      action: async () => {
        App.create_bookmarks_folder(args.callback)
      },
    })

    App.sep(items)
  }

  if (args.include_all) {
    items.push({
      text: `All`,
      action: async () => {
        App.bookmarks_folder = undefined
        App.show_mode({mode: `bookmarks`, force: true})
      },
    })
  }

  let index = 0

  if (args.folders.length) {
    index = items.length - 1

    for (let folder of args.folders) {
      items.push({
        text: folder.title,
        action: async () => {
          if (args.callback) {
            args.callback(folder)
          }
          else {
            App.open_bookmarks_folder(folder)
          }
        },
      })
    }
  }

  if (!items.length) {
    if (args.callback) {
      args.callback()
    }

    return
  }

  App.show_context({items, title: `Pick Folder`, e: args.e, index})
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
    },
  })
}

App.request_bookmarks = () => {
  browser.runtime.sendMessage({action: `refresh_bookmarks`})
}

App.make_bookmarks_folder = async (title, parent = ``) => {
  if (parent) {
    return await browser.bookmarks.create({title, parentId: parent.id})
  }

  return await browser.bookmarks.create({title})
}

App.create_bookmarks_folder = (callback) => {
  async function action(title, parent = ``) {
    let folder = await App.make_bookmarks_folder(title, parent)

    if (folder) {
      if (callback) {
        callback(folder)
      }
      else {
        let feedback = App.get_setting(`show_feedback`)

        if (feedback) {
          App.footer_message(`Folder Created`)
        }
      }
    }
  }

  App.show_prompt({
    placeholder: `Folder Name`,
    on_submit: async (title) => {
      if (!title) {
        return
      }

      if (App.active_mode === `bookmarks`) {
        if (App.bookmarks_folder) {
          action(title, App.bookmarks_folder)
          return
        }
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
    },
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

      bookmarks.push(child)
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
      try {
        let regex = new RegExp(rvalue)
        match = regex.test(value)
      }
      catch (error) {
        match = false
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

App.start_bookmark_rules_addlist = () => {
  if (App.bookmark_rules_addlist_ready) {
    return
  }

  App.debug(`Start domain rules`)
  let {popobj, regobj} = App.get_setting_addlist_objects()
  let id = `settings_bookmark_rules`
  let props = App.setting_props.bookmark_rules

  App.create_popup({...popobj, id: `addlist_${id}`,
    element: Addlist.register({...regobj, id,
      keys: [`value`, `folder`, `mode`],
      widgets: {
        value: `text`,
        folder: `text`,
        mode: `menu`,
      },
      labels: {
        value: `Value`,
        folder: `Folder`,
        mode: `Mode`,
      },
      list_text: (item) => {
        return App.remove_protocol(item.value)
      },
      required: {
        value: true,
        folder: true,
      },
      sources: {
        mode: () => {
          return [
            {text: `URL Starts With`, value: `starts_with_url`},
            {text: `URL Ends With`, value: `ends_with_url`},
            {text: `URL Includes`, value: `includes_url`},
            {text: `URL Regex`, value: `regex_url`},
            {text: App.separator_string},
            {text: `Title Starts With`, value: `starts_with_title`},
            {text: `Title Ends With`, value: `ends_with_title`},
            {text: `Title Includes`, value: `includes_title`},
            {text: `Title Regex`, value: `regex_title`},
          ]
        },
      },
      tooltips: {
        value: `Check the item URLs or titles with this`,
        folder: `Bookmark matches to this folder`,
        mode: `Match mode for URL comparison`,
      },
      title: props.name,
    })})

  App.bookmark_rules_addlist_ready = true
}

App.create_bookmark_rule = async (item, e) => {
  let perm = await App.ask_permission(`bookmarks`)

  if (!perm) {
    return
  }

  let folders = await App.get_bookmark_folders()

  if (!folders.length) {
    return
  }

  function callback(folder) {
    App.edit_bookmark_rule(item, folder)
  }

  App.do_select_bookmarks_folder({folders, callback, include_all: false, e})
}

App.edit_bookmark_rule = (item, folder) => {
  App.start_bookmark_rules_addlist()
  let id = `settings_bookmark_rules`

  let items = {
    value: item.hostname,
    folder: folder.title,
    mode: `starts_with_url`,
  }

  Addlist.edit({id, items, edit: false})
}

App.search_domain_bookmarks = (item) => {
  App.do_show_mode({
    mode: `bookmarks`,
    reuse_filter: false,
    filter: item.hostname,
  })
}

App.save_bookmarks_folder_pick = (item, e) => {
  function parent_action() {
    App.do_save_bookmarks_folder_pick(App.bookmarks_folder)
  }

  function item_action() {
    let folder = App.get_bookmarks_folder_by_id(item.id)
    App.do_save_bookmarks_folder_pick(folder)
  }

  if (!App.bookmarks_folder) {
    if (!item || !App.is_folder(item)) {
      return
    }

    item_action()
    return
  }

  if (!item || !App.is_folder(item)) {
    parent_action()
    return
  }

  let items = [
    {
      text: `Save Item`,
      action: () => {
        item_action()
      },
    },
    {
      text: `Save Parent`,
      action: () => {
        parent_action()
      },
    },
  ]

  App.show_context({items, e})
}

App.do_save_bookmarks_folder_pick = (folder) => {
  if (!folder) {
    return
  }

  let pick = {
    id: folder.id,
    title: folder.title,
  }

  let picks = App.bookmark_folder_picks
  picks = picks.filter(x => x.id !== folder.id)
  picks.unshift(pick)
  picks = picks.slice(0, App.max_bookmark_folder_picks)
  App.bookmark_folder_picks = picks
  App.stor_save_bookmark_folder_picks()
  let tb_mode = App.get_tab_box_mode()

  if ([`folders`].includes(tb_mode)) {
    App.update_tab_box()
  }
}

App.open_bookmarks_folder = (folder) => {
  App.bookmarks_folder = folder
  App.show_mode({mode: `bookmarks`, force: true})
}

App.get_bookmarks_folder_by_id = (id) => {
  for (let folder of App.bookmark_folders_cache) {
    if (folder.id === id) {
      return folder
    }
  }
}

App.get_bookmark_folder_title = (id) => {
  let folder = App.get_bookmarks_folder_by_id(id)

  if (folder) {
    return folder.title
  }
}

App.forget_bookmarks_folder_pick = (id) => {
  App.bookmark_folder_picks = App.bookmark_folder_picks.filter(x => x.id !== id)
  App.stor_save_bookmark_folder_picks()
  let tb_mode = App.get_tab_box_mode()

  if ([`folders`].includes(tb_mode)) {
    App.update_tab_box()
  }
}

App.go_to_bookmarks_parent_folder = () => {
  if (!App.bookmarks_folder) {
    return
  }

  let parent = App.get_bookmarks_folder_by_id(App.bookmarks_folder.parentId)

  if (parent) {
    App.open_bookmarks_folder(parent)
  }
}

App.travel_to_bookmarks_folder = (item) => {
  let folder = App.get_bookmarks_folder_by_id(item.id)
  App.open_bookmarks_folder(folder)
}

App.bookmark_folders_enabled = () => {
  let a = App.get_setting(`include_bookmark_folders`)
  return a && Boolean(App.bookmarks_folder)
}

App.move_folders_pick = (from, to) => {
  let picks = App.bookmark_folder_picks
  let from_index = picks.findIndex(pick => pick.id === from)
  let to_index = picks.findIndex(pick => pick.id === to)

  if (from_index === -1 || to_index === -1) {
    return
  }

  let [moved_item] = picks.splice(from_index, 1)
  picks.splice(to_index, 0, moved_item)

  App.bookmark_folder_picks = picks
  App.stor_save_bookmark_folder_picks()
  App.update_tab_box()
}

App.toggle_bookmark_folders = () => {
  let setting = App.get_setting(`include_bookmark_folders`)
  App.set_setting({setting: `include_bookmark_folders`, value: !setting})
  App.show_mode({mode: `bookmarks`, force: true})
}

App.is_folder = (item) => {
  return item.type === `folder`
}